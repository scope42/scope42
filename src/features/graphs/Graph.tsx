import { ElementDefinition, LayoutOptions, Stylesheet } from 'cytoscape'
import { useEffect, useMemo, useState } from 'react'
import { Items, useStore } from '../../data/store'
import { Item } from '../../data/types'
import { getIncomingRelations, getOutgoingRelations } from '../items'
import Cytoscape from 'cytoscape'
import CoseBilkent from 'cytoscape-cose-bilkent'
import CytoscapeComponent from 'react-cytoscapejs'

Cytoscape.use(CoseBilkent)

const STYLESHEET: Stylesheet[] = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)'
    }
  },
  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      width: 3,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: 'node[type="issue"]',
    style: {
      shape: 'diamond',
      backgroundColor: 'red'
    }
  },
  {
    selector: 'node[type="risk"]',
    style: {
      shape: 'triangle',
      backgroundColor: 'orange'
    }
  },
  {
    selector: 'node[type="improvement"]',
    style: {
      shape: 'ellipse',
      backgroundColor: 'green'
    }
  }
]

const LAYOUT: LayoutOptions = {
  name: 'cose-bilkent' as any,
  nodeDimensionsIncludeLabels: true
}

interface ItemsGraphProps {
  items: Item[]
  showRelatedItems?: boolean
  preview?: boolean
}

export const Graph: React.VFC<ItemsGraphProps> = props => {
  const { items, preview, showRelatedItems } = props
  const allItems = useStore(state => state.items)
  const [cy, setCy] = useState<Cytoscape.Core | null>(null)

  const elements = useMemo(() => {
    const toNode = (item: Item) => ({
      data: {
        id: `${item.type}:${item.id}`,
        label: item.title,
        type: item.type
      }
    })

    const itemsToDisplay = [...items]

    if (showRelatedItems) {
      items
        .flatMap(item => [
          ...getOutgoingRelations(item, allItems),
          ...getIncomingRelations(item, allItems)
        ])
        .map(relation => relation.item)
        .forEach(relatedItem => {
          if (!itemsToDisplay.find(i => i.id === relatedItem.id)) {
            itemsToDisplay.push(relatedItem)
          }
        })
    }

    const relationsPool: Items = itemsToDisplay.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {}
    )

    const nodes: ElementDefinition[] = itemsToDisplay.map(toNode)

    const edges: ElementDefinition[] = itemsToDisplay.flatMap(item =>
      getOutgoingRelations(item, relationsPool).map(relation => ({
        data: {
          id: `${item.type}:${item.id}->${relation.item.type}:${relation.item.id}`,
          source: `${item.type}:${item.id}`,
          target: `${relation.item.type}:${relation.item.id}`,
          label: relation.label
        }
      }))
    )
    return [...nodes, ...edges]
  }, [items, allItems, showRelatedItems])

  useEffect(() => {
    cy?.layout(LAYOUT).run()
  }, [cy, elements])

  return (
    <CytoscapeComponent
      cy={setCy}
      elements={elements}
      stylesheet={STYLESHEET}
      layout={LAYOUT}
      style={{
        width: '100%',
        ...(preview ? { aspectRatio: '16/9' } : { height: '80vh' })
      }}
      userZoomingEnabled={!preview}
      userPanningEnabled={!preview}
      autoungrabify={preview}
      autounselectify={preview}
    />
  )
}

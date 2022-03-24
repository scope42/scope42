import React, { useCallback, useMemo } from 'react'
import type { ElementDefinition, Stylesheet } from 'cytoscape'
import { ImprovementId, IssueId, Item, RiskId } from '../data/types'
import { selectAllImprovements, selectAllRisks, useStore } from '../data/store'
import Cytoscape from 'cytoscape'
import CoseBilkent from 'cytoscape-cose-bilkent'
import CytoscapeComponent from 'react-cytoscapejs'
import { exists, getTypeFromId } from '../data/util'

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

const SIZE = 600

class ElementsBuilder {
  #center: ElementDefinition | null = null

  #nodes: ElementDefinition[] = []

  #edges: ElementDefinition[] = []

  #createNodeElement = (item: Item): ElementDefinition => {
    return {
      data: {
        id: `${item.type}:${item.id}`,
        label: item.title,
        type: item.type
      }
    }
  }

  center(item: Item) {
    this.#center = this.#createNodeElement(item)
    return this
  }

  node(item: Item) {
    this.#nodes.push(this.#createNodeElement(item))
    return this
  }

  edge(
    source: Pick<Item, 'type' | 'id'>,
    target: Pick<Item, 'type' | 'id'>,
    label: string
  ) {
    this.#edges.push({
      data: {
        id: `${source.type}:${source.id}->${target.type}:${target.id}`,
        source: `${source.type}:${source.id}`,
        target: `${target.type}:${target.id}`,
        label
      }
    })
    return this
  }

  build(): ElementDefinition[] {
    if (!this.#center) {
      throw new Error('Center node is required')
    }

    const center = { ...this.#center, position: { x: 0, y: 0 } }

    const r = SIZE / 2 - 100

    const nodes = this.#nodes.map((node, index) => {
      return {
        ...node,
        position: {
          x: r * Math.cos((2 * Math.PI * index) / this.#nodes.length),
          y: r * Math.sin((2 * Math.PI * index) / this.#nodes.length)
        }
      }
    })

    return [center, ...nodes, ...this.#edges]
  }
}

const Graph: React.FC<{ elements: ElementDefinition[] }> = ({ elements }) => {
  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={STYLESHEET}
      layout={{
        name: 'cose-bilkent' as any,
        nodeDimensionsIncludeLabels: true
      }}
      style={{ width: SIZE, height: SIZE }}
      wheelSensitivity={0.2}
    />
  )
}

export const IssueGraph: React.VFC<{ id: IssueId }> = ({ id }) => {
  const [issue, causedBy, improvements, causedRisks] = useStore(
    useCallback(
      state => {
        const issue = state.items[id]!!
        return [
          issue,
          issue.causedBy.map(id => state.items[id]).filter(exists),
          selectAllImprovements(state).filter(i => i.resolves.includes(id)),
          selectAllRisks(state).filter(r => r.causedBy.includes(id))
        ]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center(issue)
    for (const cause of causedBy) {
      builder
        .node(cause)
        .edge(
          { type: 'issue', id },
          { type: 'issue', id: cause.id },
          'caused by'
        )
    }
    for (const improvement of improvements) {
      builder
        .node(improvement)
        .edge(
          { type: 'improvement', id: improvement.id },
          { type: 'issue', id: id },
          'resolves'
        )
    }
    for (const causedRisk of causedRisks) {
      builder
        .node(causedRisk)
        .edge(
          { type: 'issue', id: id },
          { type: 'risk', id: causedRisk.id },
          'causes'
        )
    }
    return builder.build()
  }, [id, issue, causedBy, improvements, causedRisks])
  return <Graph elements={elements} />
}

export const ImprovementGraph: React.VFC<{ id: ImprovementId }> = ({ id }) => {
  const [improvement, resolves, modifies, creates] = useStore(
    useCallback(
      state => {
        const improvement = state.items[id]!!
        return [
          improvement,
          improvement.resolves.map(id => state.items[id]).filter(exists),
          improvement.modifies.map(id => state.items[id]).filter(exists),
          improvement.creates.map(id => state.items[id]).filter(exists)
        ]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center(improvement)
    for (const issueOrRisk of resolves) {
      builder
        .node(issueOrRisk)
        .edge(
          { type: 'improvement', id: id },
          { type: getTypeFromId(issueOrRisk.id), id: issueOrRisk.id },
          'resolves'
        )
    }
    for (const risk of modifies) {
      builder
        .node(risk)
        .edge(
          { type: 'improvement', id },
          { type: 'risk', id: risk.id },
          'modifies'
        )
    }
    for (const risk of creates) {
      builder
        .node(risk)
        .edge(
          { type: 'improvement', id },
          { type: 'risk', id: risk.id },
          'creates'
        )
    }
    return builder.build()
  }, [id, improvement, resolves, modifies, creates])
  return <Graph elements={elements} />
}

export const RiskGraph: React.VFC<{ id: RiskId }> = ({ id }) => {
  const [risk, causedBy, modifiedBy, createdBy] = useStore(
    useCallback(
      state => {
        const risk = state.items[id]!!
        return [
          risk,
          risk.causedBy.map(id => state.items[id]).filter(exists),
          selectAllImprovements(state).filter(i => i.modifies.includes(id)),
          selectAllImprovements(state).filter(i => i.creates.includes(id))
        ]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center(risk)
    for (const cause of causedBy) {
      builder
        .node(cause)
        .edge(
          { type: 'risk', id },
          { type: 'issue', id: cause.id },
          'caused by'
        )
    }
    for (const improvement of modifiedBy) {
      builder
        .node(improvement)
        .edge(
          { type: 'risk', id },
          { type: 'improvement', id: improvement.id },
          'modified by'
        )
    }
    for (const improvement of createdBy) {
      builder
        .node(improvement)
        .edge(
          { type: 'risk', id },
          { type: 'improvement', id: improvement.id },
          'created by'
        )
    }

    return builder.build()
  }, [id, risk, causedBy, modifiedBy, createdBy])
  return <Graph elements={elements} />
}

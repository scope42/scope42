import React, { useCallback, useMemo } from 'react'
import { NoSsr } from '../components/NoSsr'
import dynamic from 'next/dynamic'
import type { ElementDefinition, Stylesheet } from 'cytoscape'
import { Improvement, Issue, IssueId, ItemId, Risk } from '../data/types'
import { useStore } from '../data/store'
import Cytoscape from 'cytoscape'
import CoseBilkent from 'cytoscape-cose-bilkent'

Cytoscape.use(CoseBilkent)

const CytoscapeComponent = dynamic(() => import('react-cytoscapejs'), { ssr: false })

type NodeType<T extends string, E> = {type: T; entity: E; id: ItemId}
type Node = NodeType<'issue', Issue> | NodeType<'risk', Risk> | NodeType<'improvement', Improvement>

const STYLESHEET: Stylesheet[] = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
    },
  },
  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      width: 3,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'node[type="issue"]',
    style: {
      shape: 'diamond',
      backgroundColor: 'red',
    },
  },
  {
    selector: 'node[type="risk"]',
    style: {
      shape: 'triangle',
      backgroundColor: 'orange',
    },
  },
  {
    selector: 'node[type="improvement"]',
    style: {
      shape: 'ellipse',
      backgroundColor: 'green',
    },
  },
]

const SIZE = 600

class ElementsBuilder {
  #center: ElementDefinition | null = null

  #nodes: ElementDefinition[] = []

  #edges: ElementDefinition[] = []

  #createNodeElement = (node: Node): ElementDefinition => {
    return { data: { id: `${node.type}:${node.id}`, label: node.entity.title, type: node.type } }
  }

  center(node: Node) {
    this.#center = this.#createNodeElement(node)
    return this
  }

  node(node: Node) {
    this.#nodes.push(this.#createNodeElement(node))
    return this
  }

  edge(source: Pick<Node, 'type' | 'id'>, target: Pick<Node, 'type' | 'id'>, label: string) {
    this.#edges.push({ data: {
      id: `${source.type}:${source.id}->${target.type}:${target.id}`,
      source: `${source.type}:${source.id}`,
      target: `${target.type}:${target.id}`,
      label,
    } })
    return this
  }

  build(): ElementDefinition[] {
    if (!this.#center) {
      throw new Error('Center node is required')
    }

    const center = { ...this.#center, position: { x: 0, y: 0 } }

    const r = (SIZE / 2) - 100

    const nodes = this.#nodes.map((node, index) => {
      return { ...node, position: { x: r * Math.cos(2 * Math.PI * index / this.#nodes.length), y: r * Math.sin(2 * Math.PI * index / this.#nodes.length) } }
    })

    return [center, ...nodes, ...this.#edges]
  }
}

const Graph: React.FC<{elements: ElementDefinition[]}> = ({ elements }) => {
  return <NoSsr>
    <CytoscapeComponent
      elements={elements}
      stylesheet={STYLESHEET}
      layout={{ name: 'cose-bilkent', nodeDimensionsIncludeLabels: true }}
      pan={{ x: SIZE / 2, y: SIZE / 2 }}
      style={ { width: SIZE, height: SIZE } }
    />
  </NoSsr>
}

export const IssueGraph: React.FC<{id: IssueId}> = ({ id }) => {
  const [issue, cause, improvements] = useStore(useCallback(state => {
    const issue = state.issues[id]
    return [
      issue,
      issue.cause ? { id: issue.cause, data: state.issues[issue.cause] } : undefined,
      Object.keys(state.improvements).map(id => ({ id, data: state.improvements[id] })).filter(i => i.data.solves.includes(id)),
    ]
  }, [id]))
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center({ type: 'issue', entity: issue, id })
    if (cause) {
      builder.node({ type: 'issue', entity: cause.data, id: cause.id })
          .edge({ type: 'issue', id }, { type: 'issue', id: cause.id }, 'Caused by')
    }
    for (const improvement of improvements) {
      builder.node({ type: 'improvement', entity: improvement.data, id: improvement.id })
          .edge({ type: 'improvement', id: improvement.id }, { type: 'issue', id: id }, 'Solves')
    }
    return builder.build()
  }, [id, issue, cause, improvements])
  return <Graph elements={elements} />
}

import React, { useCallback, useMemo } from 'react'
import type { ElementDefinition, Stylesheet } from 'cytoscape'
import {
  Improvement,
  ImprovementId,
  Issue,
  IssueId,
  ItemId,
  Risk,
  RiskId
} from '../data/types'
import { createItemSelector, useStore } from '../data/store'
import Cytoscape from 'cytoscape'
import CoseBilkent from 'cytoscape-cose-bilkent'
import CytoscapeComponent from 'react-cytoscapejs'
import { getTypeFromId } from '../data/util'

Cytoscape.use(CoseBilkent)

type NodeType<T extends string, E> = { type: T; entity: E; id: ItemId }
type Node =
  | NodeType<'issue', Issue>
  | NodeType<'risk', Risk>
  | NodeType<'improvement', Improvement>

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

  #createNodeElement = (node: Node): ElementDefinition => {
    return {
      data: {
        id: `${node.type}:${node.id}`,
        label: node.entity.title,
        type: node.type
      }
    }
  }

  center(node: Node) {
    this.#center = this.#createNodeElement(node)
    return this
  }

  node(node: Node) {
    this.#nodes.push(this.#createNodeElement(node))
    return this
  }

  edge(
    source: Pick<Node, 'type' | 'id'>,
    target: Pick<Node, 'type' | 'id'>,
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
        const issue = state.issues[id]
        return [
          issue,
          issue.causedBy.map(id => ({ id, data: state.issues[id] })),
          Object.keys(state.improvements)
            .map(id => ({ id, data: state.improvements[id] }))
            .filter(i => i.data.resolves.includes(id)),
          Object.keys(state.risks)
            .map(id => ({ id, data: state.risks[id] }))
            .filter(i => i.data.causedBy.includes(id))
        ]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center({ type: 'issue', entity: issue, id })
    for (const cause of causedBy) {
      builder
        .node({ type: 'issue', entity: cause.data, id: cause.id })
        .edge(
          { type: 'issue', id },
          { type: 'issue', id: cause.id },
          'caused by'
        )
    }
    for (const improvement of improvements) {
      builder
        .node({
          type: 'improvement',
          entity: improvement.data,
          id: improvement.id
        })
        .edge(
          { type: 'improvement', id: improvement.id },
          { type: 'issue', id: id },
          'resolves'
        )
    }
    for (const causedRisk of causedRisks) {
      builder
        .node({
          type: 'risk',
          entity: causedRisk.data,
          id: causedRisk.id
        })
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
  const [improvement, resolves] = useStore(
    useCallback(
      state => {
        const improvement = state.improvements[id]
        return [
          improvement,
          improvement.resolves.map(id => ({
            id,
            data: createItemSelector(id)(state)
          }))
        ]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center({ type: 'improvement', entity: improvement, id })
    for (const issueOrRisk of resolves) {
      builder
        .node({
          type: getTypeFromId(issueOrRisk.id),
          entity: issueOrRisk.data,
          id: issueOrRisk.id
        } as Node)
        .edge(
          { type: 'improvement', id: id },
          { type: getTypeFromId(issueOrRisk.id), id: issueOrRisk.id },
          'resolves'
        )
    }
    return builder.build()
  }, [id, improvement, resolves])
  return <Graph elements={elements} />
}

export const RiskGraph: React.VFC<{ id: RiskId }> = ({ id }) => {
  const [risk, causedBy] = useStore(
    useCallback(
      state => {
        const risk = state.risks[id]
        return [risk, risk.causedBy.map(id => ({ id, data: state.issues[id] }))]
      },
      [id]
    )
  )
  const elements = useMemo(() => {
    const builder = new ElementsBuilder()
    builder.center({ type: 'risk', entity: risk, id })
    for (const cause of causedBy) {
      builder
        .node({ type: 'issue', entity: cause.data, id: cause.id })
        .edge(
          { type: 'risk', id },
          { type: 'issue', id: cause.id },
          'caused by'
        )
    }

    return builder.build()
  }, [id, risk, causedBy])
  return <Graph elements={elements} />
}

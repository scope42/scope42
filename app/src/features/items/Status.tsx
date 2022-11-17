import { Tag, TagProps } from 'antd'
import React from 'react'
import {
  DecisionStatus,
  DecisionStatuses,
  ImprovementStatus,
  ImprovementStatuses,
  IssueStatus,
  IssueStatuses,
  Item,
  ItemType,
  RiskStatus,
  RiskStatuses,
  statusLabel
} from '@scope42/data'

const ISSUE_STATUS_COLORS: { [status in IssueStatus]: TagProps['color'] } = {
  current: 'red',
  resolved: 'green',
  discarded: undefined
}

const IMPROVEMENT_STATUS_COLORS: {
  [status in ImprovementStatus]: TagProps['color']
} = {
  proposed: 'cyan',
  accepted: 'blue',
  implemented: 'green',
  discarded: undefined
}

const RISK_STATUS_COLORS: { [status in RiskStatus]: TagProps['color'] } = {
  potential: 'orange',
  current: 'red',
  mitigated: 'green',
  discarded: undefined
}

const DECISION_STATUS_COLORS: {
  [status in DecisionStatus]: TagProps['color']
} = {
  proposed: 'cyan',
  accepted: 'blue',
  deprecated: undefined,
  discarded: undefined,
  superseded: undefined
}

function getStatusColor(item: Item): TagProps['color'] {
  switch (item.type) {
    case 'issue':
      return ISSUE_STATUS_COLORS[item.status]
    case 'risk':
      return RISK_STATUS_COLORS[item.status]
    case 'improvement':
      return IMPROVEMENT_STATUS_COLORS[item.status]
    case 'decision':
      return DECISION_STATUS_COLORS[item.status]
  }
}

export const ItemStatus: React.FC<{ item: Item }> = props => {
  return <Tag color={getStatusColor(props.item)}>{statusLabel(props.item)}</Tag>
}

const POSSIBLE_STATUSES: Record<ItemType, Item['status'][]> = {
  issue: Object.values(IssueStatuses),
  improvement: Object.values(ImprovementStatuses),
  risk: Object.values(RiskStatuses),
  decision: Object.values(DecisionStatuses)
}

export function getAllPossibleStatuses() {
  const possibleStatuses: Item['status'][] = []
  // ensure unique entries
  Object.values(POSSIBLE_STATUSES)
    .flatMap(s => s)
    .forEach(status => {
      if (!possibleStatuses.some(s => s === status)) {
        possibleStatuses.push(status)
      }
    })
  return possibleStatuses
}

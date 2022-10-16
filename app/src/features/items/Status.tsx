import { Tag } from 'antd'
import React from 'react'
import {
  DecisionStatus,
  ImprovementStatus,
  IssueStatus,
  Item,
  ItemType,
  RiskStatus
} from '../../data/types'

type StatusUi = { label: string; component: React.ReactNode; active: boolean }

export const ISSUE_STATUS_UI: { [status in IssueStatus]: StatusUi } = {
  current: {
    label: 'Current',
    component: <Tag color="red">Current</Tag>,
    active: true
  },
  resolved: {
    label: 'Resolved',
    component: <Tag color="green">Resolved</Tag>,
    active: false
  },
  discarded: {
    label: 'Discarded',
    component: <Tag>Discarded</Tag>,
    active: false
  }
}

export const IMPROVEMENT_STATUS_UI: {
  [status in ImprovementStatus]: StatusUi
} = {
  proposed: {
    label: 'Proposed',
    component: <Tag color="cyan">Proposed</Tag>,
    active: true
  },
  accepted: {
    label: 'Accepted',
    component: <Tag color="blue">Accepted</Tag>,
    active: true
  },
  implemented: {
    label: 'Implemented',
    component: <Tag color="green">Implemented</Tag>,
    active: false
  },
  discarded: {
    label: 'Discarded',
    component: <Tag>Discarded</Tag>,
    active: false
  }
}

export const RISK_STATUS_UI: { [status in RiskStatus]: StatusUi } = {
  potential: {
    label: 'Potential',
    component: <Tag color="orange">Potential</Tag>,
    active: true
  },
  current: {
    label: 'Current',
    component: <Tag color="red">Current</Tag>,
    active: true
  },
  mitigated: {
    label: 'Mitigated',
    component: <Tag color="green">Mitigated</Tag>,
    active: false
  },
  discarded: {
    label: 'Discarded',
    component: <Tag>Discarded</Tag>,
    active: true
  }
}

export const DECISION_STATUS_UI: { [status in DecisionStatus]: StatusUi } = {
  proposed: {
    label: 'Proposed',
    component: <Tag color="cyan">Proposed</Tag>,
    active: true
  },
  accepted: {
    label: 'Accepted',
    component: <Tag color="blue">Accepted</Tag>,
    active: true
  },
  deprecated: {
    label: 'Deprecated',
    component: <Tag>Deprecated</Tag>,
    active: false
  },
  discarded: {
    label: 'Discarded',
    component: <Tag>Discarded</Tag>,
    active: false
  },
  superseded: {
    label: 'Superseded',
    component: <Tag>Superseded</Tag>,
    active: false
  }
}

export type ItemStatusProps =
  | { type: 'issue'; status: IssueStatus }
  | { type: 'risk'; status: RiskStatus }
  | { type: 'improvement'; status: ImprovementStatus }

export const ItemStatus: React.FC<{ item: Item }> = props => {
  switch (props.item.type) {
    case 'issue':
      return <>{ISSUE_STATUS_UI[props.item.status].component}</>
    case 'risk':
      return <>{RISK_STATUS_UI[props.item.status].component}</>
    case 'improvement':
      return <>{IMPROVEMENT_STATUS_UI[props.item.status].component}</>
    case 'decision':
      return <>{DECISION_STATUS_UI[props.item.status].component}</>
  }
}

export const POSSIBLE_STATUSES: Record<
  ItemType,
  Array<{ value: string; text: string }>
> = {
  issue: IssueStatus.options.map(status => ({
    value: status,
    text: ISSUE_STATUS_UI[status].label
  })),
  improvement: ImprovementStatus.options.map(status => ({
    value: status,
    text: IMPROVEMENT_STATUS_UI[status].label
  })),
  risk: RiskStatus.options.map(status => ({
    value: status,
    text: RISK_STATUS_UI[status].label
  })),
  decision: DecisionStatus.options.map(status => ({
    value: status,
    text: DECISION_STATUS_UI[status].label
  }))
}

export function getAllPossibleStatuses() {
  const possibleStatuses: Array<{ value: string; text: string }> = []
  // ensure unique entries
  Object.values(POSSIBLE_STATUSES)
    .flatMap(s => s)
    .forEach(status => {
      if (!possibleStatuses.some(s => s.value === status.value)) {
        possibleStatuses.push(status)
      }
    })
  return possibleStatuses
}

export function isActive(item: Item): boolean {
  switch (item.type) {
    case 'issue':
      return ISSUE_STATUS_UI[item.status].active
    case 'risk':
      return RISK_STATUS_UI[item.status].active
    case 'improvement':
      return IMPROVEMENT_STATUS_UI[item.status].active
    case 'decision':
      return DECISION_STATUS_UI[item.status].active
  }
}

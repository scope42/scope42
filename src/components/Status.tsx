import { Tag } from 'antd'
import React from 'react'
import {
  ImprovementStatus,
  IssueStatus,
  ItemWithId,
  RiskStatus
} from '../data/types'

type StatusUi = { label: string; component: React.ReactNode }

export const ISSUE_STATUS_UI: { [status in IssueStatus]: StatusUi } = {
  current: { label: 'Current', component: <Tag color="red">Current</Tag> },
  resolved: { label: 'Resolved', component: <Tag color="green">Resolved</Tag> },
  discarded: { label: 'Discarded', component: <Tag>Discarded</Tag> }
}

export const IMPROVEMENT_STATUS_UI: {
  [status in ImprovementStatus]: StatusUi
} = {
  proposed: { label: 'Proposed', component: <Tag color="cyan">Proposed</Tag> },
  accepted: { label: 'Accepted', component: <Tag color="blue">Accepted</Tag> },
  implemented: {
    label: 'Implemented',
    component: <Tag color="green">Implemented</Tag>
  },
  discarded: { label: 'Discarded', component: <Tag>Discarded</Tag> }
}

export const RISK_STATUS_UI: { [status in RiskStatus]: StatusUi } = {
  potential: {
    label: 'Potential',
    component: <Tag color="orange">Potential</Tag>
  },
  current: { label: 'Current', component: <Tag color="red">Current</Tag> },
  mitigated: {
    label: 'Mitigated',
    component: <Tag color="green">Mitigated</Tag>
  },
  discarded: { label: 'Discarded', component: <Tag>Discarded</Tag> }
}

export type ItemStatusProps =
  | { type: 'issue'; status: IssueStatus }
  | { type: 'risk'; status: RiskStatus }
  | { type: 'improvement'; status: ImprovementStatus }

export const ItemStatus: React.VFC<{ item: ItemWithId }> = props => {
  switch (props.item.type) {
    case 'issue':
      return <>{ISSUE_STATUS_UI[props.item.data.status].component}</>
    case 'risk':
      return <>{RISK_STATUS_UI[props.item.data.status].component}</>
    case 'improvement':
      return <>{IMPROVEMENT_STATUS_UI[props.item.data.status].component}</>
  }
}

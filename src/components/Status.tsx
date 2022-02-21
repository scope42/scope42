import { Tag } from "antd"
import { ImprovementStatus, IssueStatus, RiskStatus } from "../data/types"

type StatusUi = { label: string, component: React.ReactNode }

export const ISSUE_STATUS_UI: {[status in IssueStatus]: StatusUi} = {
  current: { label: "Current", component: <Tag color="red">Current</Tag> },
  resolved: { label: "Resolved", component: <Tag color="green">Resolved</Tag> },
  discarded: { label: "Discarded", component: <Tag>Discarded</Tag> }
}

export const IMPROVEMENT_STATUS_UI: {[status in ImprovementStatus]: StatusUi} = {
  proposed: { label: "Proposed", component: <Tag color="cyan">Proposed</Tag> },
  accepted: { label: "Accepted", component: <Tag color="blue">Accepted</Tag> },
  implemented: { label: "Implemented", component: <Tag color="green">Implemented</Tag> },
  discarded: { label: "Discarded", component: <Tag>Discarded</Tag> }
}

export const RISK_STATUS_UI: {[status in RiskStatus]: StatusUi} = {
  current: { label: "Current", component: <Tag color="red">Current</Tag> },
  mitigated: { label: "Mitigated", component: <Tag color="green">Mitigated</Tag> },
  discarded: { label: "Discarded", component: <Tag>Discarded</Tag> }
}
import { Tag } from "antd"
import { IssueStatus } from "../data/types"

type StatusUi = { label: string, component: React.ReactNode }

export const ISSUE_STATUS_UI: {[status in IssueStatus]: StatusUi} = {
  current: { label: "Current", component: <Tag color="red">Current</Tag> },
  potential: { label: "Potential", component: <Tag color="orange">Potential</Tag> },
  resolved: { label: "Resolved", component: <Tag color="green">Resolved</Tag> },
  discarded: { label: "Discarded", component: <Tag>Discarded</Tag> }
}
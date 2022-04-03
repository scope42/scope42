/* eslint-disable react/display-name */
import { IssueStatus } from '../data/types'
import { selectAllIssues, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ISSUE_STATUS_UI } from '../components/Status'
import { ItemsTablePage } from '../features/items'

const possibleStatuses = IssueStatus.options.map(status => ({
  value: status,
  text: ISSUE_STATUS_UI[status].label
}))

const defaultVisibleStatuses: IssueStatus[] = ['current']

export default function IssuesPage() {
  const issues = useStore(selectAllIssues)

  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTablePage
        id="issues"
        itemType="issue"
        items={issues}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      ></ItemsTablePage>
    </div>
  )
}

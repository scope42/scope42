/* eslint-disable react/display-name */
import { IssueStatuses, statusActive } from '@scope42/data'
import { selectAllIssues, useStore } from '../data/store'
import { PageHeader } from '../features/layout'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses = IssueStatuses.filter(statusActive)

export default function IssuesTablePage() {
  const issues = useStore(selectAllIssues)

  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTablePage
        id="issues"
        items={issues}
        possibleStatuses={IssueStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="issue" />
      </ItemsTablePage>
    </div>
  )
}

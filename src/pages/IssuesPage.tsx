/* eslint-disable react/display-name */
import { IssueStatus } from '../data/types'
import { selectAllIssues, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { POSSIBLE_STATUSES } from '../components/Status'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses: IssueStatus[] = ['current']

export default function IssuesPage() {
  const issues = useStore(selectAllIssues)

  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTablePage
        id="issues"
        items={issues}
        possibleStatuses={POSSIBLE_STATUSES.issue}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="issue" />
      </ItemsTablePage>
    </div>
  )
}

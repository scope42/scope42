/* eslint-disable react/display-name */
import { IssueStatus, ItemWithId } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'
import { ISSUE_STATUS_UI } from '../components/Status'

const possibleStatuses = IssueStatus.options.map(status => ({
  value: status,
  text: ISSUE_STATUS_UI[status].label
}))

const defaultVisibleStatuses: IssueStatus[] = ['current']

export default function IssuesPage() {
  const issues = useStore(state => state.issues)

  const items: ItemWithId[] = Object.keys(issues).map(id => ({
    data: issues[id],
    id,
    type: 'issue'
  }))

  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTable
        items={items}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      />
    </div>
  )
}

/* eslint-disable react/display-name */
import { ItemWithId } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'

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
      <ItemsTable items={items} />
    </div>
  )
}

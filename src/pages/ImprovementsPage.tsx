/* eslint-disable react/display-name */
import { ItemWithId } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'

export default function ImprovementsPage() {
  const improvements = useStore(state => state.improvements)
  const items: ItemWithId[] = Object.keys(improvements).map(id => ({
    data: improvements[id],
    id,
    type: 'improvement'
  }))
  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTable items={items} />
    </div>
  )
}

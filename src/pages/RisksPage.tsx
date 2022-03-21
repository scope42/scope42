/* eslint-disable react/display-name */
import { ItemWithId } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'

export default function RisksPage() {
  const risks = useStore(state => state.risks)
  const items: ItemWithId[] = Object.keys(risks).map(id => ({
    data: risks[id],
    id,
    type: 'risk'
  }))
  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTable items={items} />
    </div>
  )
}

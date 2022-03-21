/* eslint-disable react/display-name */
import { ImprovementStatus, ItemWithId } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'

const possibleStatuses = ImprovementStatus.options.map(status => ({
  value: status,
  text: IMPROVEMENT_STATUS_UI[status].label
}))

const defaultVisibleStatuses: ImprovementStatus[] = ['proposed', 'accepted']

export default function ImprovementsPage() {
  const improvements = useStore(state => state.improvements)

  const items: ItemWithId[] = Object.keys(improvements).map(id => ({
    data: improvements[id],
    id,
    type: 'improvement'
  }))

  return (
    <div>
      <PageHeader title="Improvements" />
      <ItemsTable
        items={items}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      />
    </div>
  )
}

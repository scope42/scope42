/* eslint-disable react/display-name */
import { ImprovementStatus } from '../data/types'
import { selectAllImprovements, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'

const possibleStatuses = ImprovementStatus.options.map(status => ({
  value: status,
  text: IMPROVEMENT_STATUS_UI[status].label
}))

const defaultVisibleStatuses: ImprovementStatus[] = ['proposed', 'accepted']

export default function ImprovementsPage() {
  const improvements = useStore(selectAllImprovements)

  return (
    <div>
      <PageHeader title="Improvements" />
      <ItemsTable
        items={improvements}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      />
    </div>
  )
}

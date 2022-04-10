/* eslint-disable react/display-name */
import { ImprovementStatus } from '../data/types'
import { selectAllImprovements, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

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
      <ItemsTablePage
        id="improvements"
        items={improvements}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="improvement" />
      </ItemsTablePage>
    </div>
  )
}

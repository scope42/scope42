/* eslint-disable react/display-name */
import { ImprovementStatus } from '../data/types'
import { selectAllImprovements, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { POSSIBLE_STATUSES } from '../components/Status'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses: ImprovementStatus[] = ['proposed', 'accepted']

export default function ImprovementsPage() {
  const improvements = useStore(selectAllImprovements)

  return (
    <div>
      <PageHeader title="Improvements" />
      <ItemsTablePage
        id="improvements"
        items={improvements}
        possibleStatuses={POSSIBLE_STATUSES.improvement}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="improvement" />
      </ItemsTablePage>
    </div>
  )
}

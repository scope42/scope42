/* eslint-disable react/display-name */
import { ImprovementStatus } from '../data/types'
import { selectAllImprovements, useStore } from '../data/store'
import { PageHeader } from '../features/layout'
import { POSSIBLE_STATUSES } from '../features/items'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses: ImprovementStatus[] = ['proposed', 'accepted']

export default function ImprovementsTablePage() {
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

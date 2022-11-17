/* eslint-disable react/display-name */
import { ImprovementStatuses, statusActive } from '@scope42/data'
import { selectAllImprovements, useStore } from '../data/store'
import { PageHeader } from '../features/layout'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses = ImprovementStatuses.filter(statusActive)

export default function ImprovementsTablePage() {
  const improvements = useStore(selectAllImprovements)

  return (
    <div>
      <PageHeader title="Improvements" />
      <ItemsTablePage
        id="improvements"
        items={improvements}
        possibleStatuses={ImprovementStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="improvement" />
      </ItemsTablePage>
    </div>
  )
}

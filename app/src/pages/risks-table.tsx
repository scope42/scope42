/* eslint-disable react/display-name */
import { RiskStatuses, statusActive } from '@scope42/data'
import { selectAllRisks, useStore } from '../data/store'
import { PageHeader } from '../features/layout'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses = RiskStatuses.filter(statusActive)

export default function RisksTablePage() {
  const risks = useStore(selectAllRisks)

  return (
    <div>
      <PageHeader title="Risks" />
      <ItemsTablePage
        id="risks"
        items={risks}
        possibleStatuses={RiskStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="risk" />
      </ItemsTablePage>
    </div>
  )
}

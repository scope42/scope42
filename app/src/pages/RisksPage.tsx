/* eslint-disable react/display-name */
import { RiskStatus } from '../data/types'
import { selectAllRisks, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { POSSIBLE_STATUSES } from '../components/Status'
import { ItemsTablePage } from '../features/items'
import { Aim42ItemDescription } from '../features/aim42'

const defaultVisibleStatuses: RiskStatus[] = ['potential', 'current']

export default function RisksPage() {
  const risks = useStore(selectAllRisks)

  return (
    <div>
      <PageHeader title="Risks" />
      <ItemsTablePage
        id="risks"
        items={risks}
        possibleStatuses={POSSIBLE_STATUSES.risk}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <Aim42ItemDescription type="risk" />
      </ItemsTablePage>
    </div>
  )
}

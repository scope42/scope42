/* eslint-disable react/display-name */
import { RiskStatus } from '../data/types'
import { selectAllRisks, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'
import { RISK_STATUS_UI } from '../components/Status'

const possibleStatuses = RiskStatus.options.map(status => ({
  value: status,
  text: RISK_STATUS_UI[status].label
}))

const defaultVisibleStatuses: RiskStatus[] = ['potential', 'current']

export default function RisksPage() {
  const risks = useStore(selectAllRisks)

  return (
    <div>
      <PageHeader title="Risks" />
      <ItemsTable
        items={risks}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      />
    </div>
  )
}

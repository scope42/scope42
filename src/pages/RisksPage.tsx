/* eslint-disable react/display-name */
import { ItemWithId, RiskStatus } from '../data/types'
import { useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { ItemsTable } from '../components/ItemsTable'
import { RISK_STATUS_UI } from '../components/Status'

const possibleStatuses = RiskStatus.options.map(status => ({
  value: status,
  text: RISK_STATUS_UI[status].label
}))

const defaultVisibleStatuses: RiskStatus[] = ['potential', 'current']

export default function RisksPage() {
  const risks = useStore(state => state.risks)

  const items: ItemWithId[] = Object.keys(risks).map(id => ({
    data: risks[id],
    id,
    type: 'risk'
  }))

  return (
    <div>
      <PageHeader title="Risks" />
      <ItemsTable
        items={items}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      />
    </div>
  )
}

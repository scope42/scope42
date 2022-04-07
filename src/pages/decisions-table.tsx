// https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
import { DecisionStatus } from '../data/types'
import { selectAllDecisions, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { DECISION_STATUS_UI } from '../components/Status'
import { ItemsTablePage } from '../features/items'

const possibleStatuses = DecisionStatus.options.map(status => ({
  value: status,
  text: DECISION_STATUS_UI[status].label
}))

const defaultVisibleStatuses: DecisionStatus[] = ['proposed', 'accepted']

export default function DecisionsTablePage() {
  const decisions = useStore(selectAllDecisions)

  return (
    <div>
      <PageHeader title="Issues" />
      <ItemsTablePage
        id="decisions"
        items={decisions}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      ></ItemsTablePage>
    </div>
  )
}

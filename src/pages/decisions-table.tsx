import { DecisionStatus } from '../data/types'
import { selectAllDecisions, useStore } from '../data/store'
import { PageHeader } from '../components/PageHeader'
import { DECISION_STATUS_UI } from '../components/Status'
import { ItemsTablePage } from '../features/items'
import { AttributionCard } from '../features/ui'
import { ExternalLink } from '../components/ExternalLink'

const possibleStatuses = DecisionStatus.options.map(status => ({
  value: status,
  text: DECISION_STATUS_UI[status].label
}))

const defaultVisibleStatuses: DecisionStatus[] = ['proposed', 'accepted']

export default function DecisionsTablePage() {
  const decisions = useStore(selectAllDecisions)

  return (
    <>
      <PageHeader title="Decisions" />
      <ItemsTablePage
        id="decisions"
        items={decisions}
        possibleStatuses={possibleStatuses}
        defaultVisibleStatuses={defaultVisibleStatuses}
      >
        <AttributionCard
          title="Architecture Decision Record (ADR)"
          attribution={
            <>
              <ExternalLink url="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions">
                Documenting Architecture Decisions
              </ExternalLink>{' '}
              by Michael Nygard, CC0
            </>
          }
        >
          An architecture decision record [...] describes a set of forces and a
          single decision in response to those forces. Note that the decision is
          the central piece here, so specific forces may appear in multiple
          ADRs.
        </AttributionCard>
      </ItemsTablePage>
    </>
  )
}

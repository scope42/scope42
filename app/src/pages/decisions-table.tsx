import { DecisionStatuses, statusActive } from '@scope42/data'
import { selectAllDecisions, useStore } from '../data/store'
import { PageHeader } from '../features/layout'
import { ItemsTablePage } from '../features/items'
import { AttributionCard } from '../features/ui'
import { ExternalLink } from '../features/ui'

const defaultVisibleStatuses = DecisionStatuses.filter(statusActive)

export default function DecisionsTablePage() {
  const decisions = useStore(selectAllDecisions)

  return (
    <>
      <PageHeader title="Decisions" />
      <ItemsTablePage
        id="decisions"
        items={decisions}
        possibleStatuses={DecisionStatuses}
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

import { Decision } from './decision'
import { Improvement } from './improvement'
import { Issue } from './issue'
import { IssueId, ImprovementId, RiskId, DecisionId } from './item-id'
import { Risk } from './risk'

export * from './workspace-config'

export * from './item-id'
export { ItemType, Aim42ItemType, Comment } from './item-base'

export * from './issue'
export * from './risk'
export * from './improvement'
export * from './decision'

export type Item = Issue | Risk | Improvement | Decision

export type IndexedItems = Partial<
  Record<IssueId, Issue> &
    Record<ImprovementId, Improvement> &
    Record<RiskId, Risk> &
    Record<DecisionId, Decision>
>

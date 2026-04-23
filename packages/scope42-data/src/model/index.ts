import { ItemBase, ItemType } from './item-base'
import {
  IssueFrontmatter,
  IssueFrontmatterSchema,
  IssueStatus,
  IssueStatuses
} from './issue'
import {
  RiskFrontmatter,
  RiskFrontmatterSchema,
  RiskStatus,
  RiskStatuses
} from './risk'
import {
  ImprovementFrontmatter,
  ImprovementFrontmatterSchema,
  ImprovementStatus,
  ImprovementStatuses
} from './improvement'
import {
  DecisionFrontmatter,
  DecisionFrontmatterSchema,
  DecisionStatus,
  DecisionStatuses
} from './decision'

export { ItemType }
export {
  IssueFrontmatterSchema,
  IssueStatuses,
  RiskFrontmatterSchema,
  RiskStatuses,
  ImprovementFrontmatterSchema,
  ImprovementStatuses,
  DecisionFrontmatterSchema,
  DecisionStatuses
}
export type {
  IssueFrontmatter,
  IssueStatus,
  RiskFrontmatter,
  RiskStatus,
  ImprovementFrontmatter,
  ImprovementStatus,
  DecisionFrontmatter,
  DecisionStatus
}

export * from './workspace-config'
export * from './relation-patterns'

export type Issue = ItemBase<'issue', IssueFrontmatter>
export type Risk = ItemBase<'risk', RiskFrontmatter>
export type Improvement = ItemBase<'improvement', ImprovementFrontmatter>
export type Decision = ItemBase<'decision', DecisionFrontmatter>

export type Item = Issue | Risk | Improvement | Decision

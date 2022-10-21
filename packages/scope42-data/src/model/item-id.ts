import { z } from 'zod'

// We could cover 5 digits with an exaustive template literal type but it causes
// performance issues in VSCode.
/** Integer from 1 to 99999 */
type Serial = `${number}`

// IDs are used to refer to items, e.g. in relations and links.

export type IssueId = `issue-${Serial}`
export const IssueId = z
  .string()
  .regex(/issue-[1-9][0-9]{0,4}/)
  .transform(id => id as IssueId)

export type RiskId = `risk-${Serial}`
export const RiskId = z
  .string()
  .regex(/risk-[1-9][0-9]{0,4}/)
  .transform(id => id as RiskId)

export type ImprovementId = `improvement-${Serial}`
export const ImprovementId = z
  .string()
  .regex(/improvement-[1-9][0-9]{0,4}/)
  .transform(id => id as ImprovementId)

export type DecisionId = `decision-${Serial}`
export const DecisionId = z
  .string()
  .regex(/decision-[1-9][0-9]{0,4}/)
  .transform(id => id as DecisionId)

export type ItemId = IssueId | RiskId | ImprovementId | DecisionId

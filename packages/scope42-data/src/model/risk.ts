import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { RiskId, IssueId } from './item-id'

export const RiskStatuses = [
  'potential',
  'current',
  'mitigated',
  'discarded'
] as const

export type RiskStatus = typeof RiskStatuses[number]

// In the original aim42 model, risk inherits from issue. We treat it as an independent
// item type for now. This especially means the ID space is distinct from issues.
export const RiskSchema = Item('risk', RiskId).extend({
  status: z.enum(RiskStatuses),
  description: nullsafeOptional(z.string()), // TODO move to details
  causedBy: z.array(IssueId).default([])
})
export type Risk = z.infer<typeof RiskSchema>

export const RiskFileContentSchema = ItemFileContent(RiskSchema)
export type RiskFileContent = z.infer<typeof RiskFileContentSchema>

export const NewRiskSchema = NewItem(RiskSchema)
export type NewRisk = z.infer<typeof NewRiskSchema>

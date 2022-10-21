import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { RiskId, IssueId } from './item-id'

export const RiskStatus = z.enum([
  'potential',
  'current',
  'mitigated',
  'discarded'
])
export type RiskStatus = z.infer<typeof RiskStatus>

// In the original aim42 model, risk inherits from issue. We treat it as an independent
// item type for now. This especially means the ID space is distinct from issues.
export const Risk = Item('risk', RiskId).extend({
  status: RiskStatus.default('current'),
  description: nullsafeOptional(z.string()), // TODO move to details
  causedBy: z.array(IssueId).default([])
})
export type Risk = z.infer<typeof Risk>

export const RiskFileContent = ItemFileContent(Risk)
export type RiskFileContent = z.infer<typeof RiskFileContent>

export const NewRisk = NewItem(Risk)
export type NewRisk = z.infer<typeof NewRisk>

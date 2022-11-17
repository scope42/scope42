import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { ImprovementId, IssueId, RiskId } from './item-id'

export const ImprovementStatuses = [
  'proposed',
  'accepted',
  'implemented',
  'discarded'
] as const

export type ImprovementStatus = typeof ImprovementStatuses[number]

export const ImprovementSchema = Item('improvement', ImprovementId).extend({
  status: z.enum(ImprovementStatuses),
  description: nullsafeOptional(z.string()), // TODO move to details
  resolves: z.array(IssueId.or(RiskId)).min(1),
  modifies: z.array(RiskId).default([]),
  creates: z.array(RiskId).default([])
})
export type Improvement = z.infer<typeof ImprovementSchema>

export const ImprovementFileContentSchema = ItemFileContent(ImprovementSchema)
export type ImprovementFileContent = z.infer<
  typeof ImprovementFileContentSchema
>

export const NewImprovementSchema = NewItem(ImprovementSchema)
export type NewImprovement = z.infer<typeof NewImprovementSchema>

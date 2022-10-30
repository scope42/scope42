/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { ImprovementId, IssueId, RiskId } from './item-id'

export const ImprovementStatus = z.enum([
  'proposed',
  'accepted',
  'implemented',
  'discarded'
])
export type ImprovementStatus = z.infer<typeof ImprovementStatus>

export const Improvement = Item('improvement', ImprovementId).extend({
  status: ImprovementStatus.default('proposed'),
  description: nullsafeOptional(z.string()), // TODO move to details
  resolves: z.array(IssueId.or(RiskId)).min(1),
  modifies: z.array(RiskId).default([]),
  creates: z.array(RiskId).default([])
})
export type Improvement = z.infer<typeof Improvement>

export const ImprovementFileContent = ItemFileContent(Improvement)
export type ImprovementFileContent = z.infer<typeof ImprovementFileContent>

export const NewImprovement = NewItem(Improvement)
export type NewImprovement = z.infer<typeof NewImprovement>

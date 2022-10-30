/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'
import { nullsafeOptional, DeserializableDate } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { DecisionId, ImprovementId } from './item-id'

export const DecisionStatus = z.enum([
  'proposed',
  'accepted',
  'deprecated',
  'superseded',
  'discarded'
])
export type DecisionStatus = z.infer<typeof DecisionStatus>

export const DecisionOption = z.object({
  title: z.string().min(1),
  description: nullsafeOptional(z.string()),
  pros: nullsafeOptional(z.string()),
  cons: nullsafeOptional(z.string())
})
export type DecisionOption = z.infer<typeof DecisionOption>

export const DecisionOutcome = z.object({
  optionIndex: z.number().int().min(0),
  rationale: nullsafeOptional(z.string()),
  positiveConsequences: nullsafeOptional(z.string()),
  negativeConsequences: nullsafeOptional(z.string())
})
export type DecisionOutcome = z.infer<typeof DecisionOutcome>

const DecisionSchema = Item('decision', DecisionId).extend({
  status: DecisionStatus.default('proposed'),
  supersededBy: nullsafeOptional(DecisionId),
  deciders: z.array(z.string().min(1)).default([]),
  decided: nullsafeOptional(DeserializableDate),
  assesses: z.array(ImprovementId).default([]),
  context: z.string().min(1), // TODO move to details
  drivers: nullsafeOptional(z.string()), // TODO move to details
  options: z.array(DecisionOption).default([]), // TODO move to details
  outcome: nullsafeOptional(DecisionOutcome) // TODO move to details
})

const validateOutcomeExists: Parameters<typeof DecisionSchema['refine']> = [
  decision =>
    !decision.outcome || decision.outcome.optionIndex < decision.options.length,
  {
    message: 'Chosen option index is out of bounds',
    path: ['outcome', 'optionIndex']
  }
]

export const Decision = DecisionSchema.refine(...validateOutcomeExists)

export type Decision = z.infer<typeof Decision>

export const DecisionFileContent = ItemFileContent(DecisionSchema).refine(
  decision =>
    !decision.outcome || decision.outcome.optionIndex < decision.options.length,
  {
    message: 'Chosen option index is out of bounds',
    path: ['outcome', 'optionIndex']
  }
)
export type DecisionFileContent = z.infer<typeof DecisionFileContent>

export const NewDecision = NewItem(DecisionSchema)
export type NewDecision = z.infer<typeof NewDecision>

/* eslint-disable @typescript-eslint/no-redeclare */

/*
 * The data model defined here is based on the aim42 domain model (https://aim42.github.io/#Domain-Model)
 * by Gernot Starke (https://www.gernotstarke.de/) and community contributors, used under CC BY-SA
 * (https://creativecommons.org/licenses/by-sa/4.0/).
 */

import { z, ZodTypeAny } from 'zod'

// ###########
// # Commons #
// ###########

const DeserializableDate = z.preprocess(arg => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}, z.date())

/**
 * Converts `null` to `undefined` before parsing. This is needed beacuse our
 * forms may produce `null`s for emtpy values. This also allows `null`s in YAML
 * files without polluting our type declarations.
 */
function nullsafeOptional<T extends ZodTypeAny>(schema: T) {
  return z.preprocess(
    arg => (arg === null ? undefined : arg),
    schema.optional()
  )
}

const Tag = z.string().nonempty()

export const Aim42ItemType = z.enum(['issue', 'risk', 'improvement'])
export type Aim42ItemType = z.infer<typeof Aim42ItemType>

export const ItemType = Aim42ItemType.or(z.enum(['decision']))
export type ItemType = z.infer<typeof ItemType>

export const Comment = z.object({
  author: z.string().nonempty(),
  created: DeserializableDate.default(() => new Date()),
  content: z.string().nonempty()
})
export type Comment = z.infer<typeof Comment>

/**
 * Common properties of all items.
 */
function Item<T extends ItemType, I extends z.ZodType<ItemId, any, any>>(
  type: T,
  idSchema: I
) {
  return z.object({
    type: z.literal(type).default(type as any),
    id: idSchema,
    title: z.string().nonempty(),
    tags: z.array(Tag).default([]),
    created: DeserializableDate.default(() => new Date()),
    modified: DeserializableDate.default(() => new Date()),
    ticket: nullsafeOptional(z.string()),
    comments: z.array(Comment).default([]) // TODO move to details
  })
}
export type Item = Issue | Risk | Improvement | Decision

function NewItem<T extends z.ZodRawShape>(item: z.ZodObject<T>) {
  return item.omit({ id: true })
}

/**
 * Details are extended data that is not kept in the store. It is only intended
 * for display on the item's detail page. Details may also be be subjected to
 * the search index.
 */
const ItemDetails = z.object({
  // description: nullsafeOptional(z.string()) // TODO
})

/**
 * This creates the schema for the content of an item file. It includes the item
 * details and omits the properties that are derivable from the file name and
 * location.
 */
function ItemFileContent<T extends z.ZodRawShape>(item: z.ZodObject<T>) {
  return item.merge(ItemDetails).omit({ id: true, type: true })
}

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

// #########
// # Issue #
// #########

export const IssueStatus = z.enum(['current', 'resolved', 'discarded'])
export type IssueStatus = z.infer<typeof IssueStatus>

export const Issue = Item('issue', IssueId).extend({
  status: IssueStatus.default('current'),
  description: nullsafeOptional(z.string()), // TODO move to details
  causedBy: z.array(IssueId).default([])
})
export type Issue = z.infer<typeof Issue>

export const IssueFileContent = ItemFileContent(Issue)
export type IssueFileContent = z.infer<typeof IssueFileContent>

export const NewIssue = NewItem(Issue)
export type NewIssue = z.infer<typeof NewIssue>

// ########
// # Risk #
// ########

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

// ###############
// # Improvement #
// ###############

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

// ############
// # Decision #
// ############

export const DecisionStatus = z.enum([
  'proposed',
  'accepted',
  'deprecated',
  'superseded',
  'discarded'
])
export type DecisionStatus = z.infer<typeof DecisionStatus>

export const DecisionOption = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional()
})
export type DecisionOption = z.infer<typeof DecisionOption>

export const DecisionOutcome = z.object({
  optionIndex: z.number().int().min(0),
  rationale: z.string().optional(),
  positiveConsequences: z.string().optional(),
  negativeConsequences: z.string().optional()
})
export type DecisionOutcome = z.infer<typeof DecisionOutcome>

const DecisionSchema = Item('decision', DecisionId).extend({
  status: DecisionStatus.default('proposed'),
  supersededBy: DecisionId.optional(),
  deciders: z.array(z.string().nonempty()).default([]),
  decided: nullsafeOptional(DeserializableDate),
  assesses: z.array(ImprovementId).default([]),
  context: z.string().nonempty(), // TODO move to details
  drivers: nullsafeOptional(z.string()), // TODO move to details
  options: z.array(DecisionOption).default([]), // TODO move to details
  outcome: nullsafeOptional(DecisionOutcome) // TODO move to details
})

export const Decision = DecisionSchema.refine(
  decision =>
    !decision.outcome || decision.outcome.optionIndex < decision.options.length,
  {
    message: 'Chosen option index is out of bounds',
    path: ['outcome', 'optionIndex']
  }
)

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

// #############
// # Workspace #
// #############

export const WorkspaceConfig = z.object({
  version: z.number().positive().int().default(1)
})

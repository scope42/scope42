import { z, ZodTypeAny } from 'zod'

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

export const IssueId = z.string().regex(/issue-[1-9][0-9]*/)
export const RiskId = z.string().regex(/risk-[1-9][0-9]*/)
export const ImprovementId = z.string().regex(/improvement-[1-9][0-9]*/)

export const IssueStatus = z.enum(['current', 'resolved', 'discarded'])
export const RiskStatus = z.enum(['current', 'mitigated', 'discarded'])
export const ImprovementStatus = z.enum([
  'proposed',
  'accepted',
  'implemented',
  'discarded'
])

const Tag = z.string().nonempty()

const Item = z.object({
  title: z.string().nonempty(),
  body: nullsafeOptional(z.string()),
  tags: z.array(Tag).default([]),
  created: DeserializableDate.default(() => new Date()),
  modified: DeserializableDate.default(() => new Date())
})

export const Risk = Item.extend({
  status: RiskStatus.default('current'),
  cause: nullsafeOptional(IssueId)
})

export const Issue = Item.extend({
  status: IssueStatus.default('current'),
  cause: nullsafeOptional(IssueId)
})

export const Improvement = Item.extend({
  status: ImprovementStatus.default('proposed'),
  solves: z.array(IssueId).default([])
})

export const WorkspaceConfig = z.object({
  version: z.number().positive().int().default(1)
})

/* eslint-disable @typescript-eslint/no-redeclare */

export type IssueId = z.infer<typeof IssueId>
export type RiskId = z.infer<typeof RiskId>
export type ImprovementId = z.infer<typeof ImprovementId>
export type Issue = z.infer<typeof Issue>
export type Risk = z.infer<typeof Risk>
export type Improvement = z.infer<typeof Improvement>
export type ItemId = IssueId | RiskId | ImprovementId
export type IssueStatus = z.infer<typeof IssueStatus>
export type RiskStatus = z.infer<typeof RiskStatus>
export type ImprovementStatus = z.infer<typeof ImprovementStatus>

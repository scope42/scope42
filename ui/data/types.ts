import { z } from 'zod'

const DateString = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)

const IssueId = z.string().regex(/issues\/[0-9a-zA-Z_-]+/)
const RiskId = z.string().regex(/risks\/[0-9a-zA-Z_-]+/)
const ImprovementId = z.string().regex(/improvements\/[0-9a-zA-Z_-]+/)

const IssueStatus = z.enum(['potential', 'current', 'resolved', 'discarded'])
const RiskStatus = z.enum(['current', 'mitigated', 'discarded'])
const ImprovementStatus  = z.enum(['proposed', 'accepted', 'implemented', 'discarded'])

const Tag = z.string().nonempty()

const Item = z.object({
  title: z.string().nonempty(),
  body: z.string().optional(),
  tags: z.array(Tag).default([]),
  created: DateString,
  modified: DateString,
})

export const Risk = Item.extend({
  status: RiskStatus.default('current'),
})

export const Issue = Item.extend({
  status: IssueStatus.default('current'),
  cause: IssueId.optional(),
})

export const Improvement = Item.extend({
  status: ImprovementStatus.default('proposed'),
  solves: z.array(IssueId).default([]),
})

export type IssueId = z.infer<typeof IssueId>;
export type RiskId = z.infer<typeof RiskId>;
export type ImprovementId = z.infer<typeof ImprovementId>;
export type Issue = z.infer<typeof Issue>;
export type Risk = z.infer<typeof Risk>;
export type Improvement = z.infer<typeof Improvement>;

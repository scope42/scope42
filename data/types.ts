import { z } from 'zod'

const DateString = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)

const IssueId = z.string().regex(/issue-[1-9][0-9]*/)
const RiskId = z.string().regex(/risk-[1-9][0-9]*/)
const ImprovementId = z.string().regex(/improvement-[1-9][0-9]*/)

const IssueStatus = z.enum(['potential', 'current', 'resolved', 'discarded'])
const RiskStatus = z.enum(['current', 'mitigated', 'discarded'])
const ImprovementStatus  = z.enum(['proposed', 'accepted', 'implemented', 'discarded'])

const Tag = z.string().nonempty()

const Item = z.object({
  title: z.string().nonempty(),
  body: z.string().optional(),
  tags: z.array(Tag).default([]),
  created: z.date().default(() => new Date()),
  modified: z.date().default(() => new Date()),
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

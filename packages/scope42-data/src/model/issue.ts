import { z } from 'zod'

export const IssueStatuses = ['current', 'resolved', 'discarded'] as const
export type IssueStatus = typeof IssueStatuses[number]

export const IssueFrontmatterSchema = z
  .object({
    status: z.enum(IssueStatuses),
    tags: z.array(z.string().min(1)).default([]),
    causedBy: z.array(z.string().min(1)).default([])
  })
  .passthrough()

export type IssueFrontmatter = z.infer<typeof IssueFrontmatterSchema>

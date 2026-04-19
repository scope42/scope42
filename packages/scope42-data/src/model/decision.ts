import { z } from 'zod'

export const DecisionStatuses = [
  'proposed',
  'accepted',
  'deprecated',
  'superseded',
  'discarded'
] as const
export type DecisionStatus = typeof DecisionStatuses[number]

export const DecisionFrontmatterSchema = z
  .object({
    status: z.enum(DecisionStatuses),
    tags: z.array(z.string().min(1)).default([]),
    supersededBy: z.string().min(1).optional(),
    assesses: z.array(z.string().min(1)).default([]),
    decided: z.coerce.date().optional()
  })
  .passthrough()

export type DecisionFrontmatter = z.infer<typeof DecisionFrontmatterSchema>

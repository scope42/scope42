import { z } from 'zod'

export const ImprovementStatuses = [
  'proposed',
  'accepted',
  'implemented',
  'discarded'
] as const
export type ImprovementStatus = typeof ImprovementStatuses[number]

export const ImprovementFrontmatterSchema = z
  .object({
    status: z.enum(ImprovementStatuses),
    tags: z.array(z.string().min(1)).default([]),
    resolves: z.array(z.string().min(1)).min(1),
    modifies: z.array(z.string().min(1)).default([]),
    creates: z.array(z.string().min(1)).default([])
  })
  .passthrough()

export type ImprovementFrontmatter = z.infer<
  typeof ImprovementFrontmatterSchema
>

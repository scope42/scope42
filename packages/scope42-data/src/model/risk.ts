import { z } from 'zod'

export const RiskStatuses = [
  'potential',
  'current',
  'mitigated',
  'discarded'
] as const
export type RiskStatus = (typeof RiskStatuses)[number]

export const RiskFrontmatterSchema = z
  .object({
    status: z.enum(RiskStatuses),
    tags: z.array(z.string().min(1)).default([]),
    causedBy: z.array(z.string().min(1)).default([])
  })
  .passthrough()

export type RiskFrontmatter = z.infer<typeof RiskFrontmatterSchema>

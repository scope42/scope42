/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'

export const WorkspaceConfig = z.object({
  version: z.number().positive().int().default(1)
})

export type WorkspaceConfig = z.infer<typeof WorkspaceConfig>

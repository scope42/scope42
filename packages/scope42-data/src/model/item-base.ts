/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'

export const ItemType = z.enum(['issue', 'risk', 'improvement', 'decision'])
export type ItemType = z.infer<typeof ItemType>

/**
 * Shape of a loaded item: its inferred id and type, the parsed frontmatter
 * of the corresponding schema, the raw body text, and the workspace-relative
 * file path. Used as a generic parameter base by the per-type aliases in
 * `./index.ts`.
 */
export interface ItemBase<T extends ItemType, F> {
  id: string
  type: T
  frontmatter: F
  body: string
  filePath: string
}

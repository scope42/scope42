/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'
import { RELATION_TYPES, RELATION_TYPE_PATTERNS } from './relation-patterns'

// Parses a regex string and exposes a compiled RegExp. Invalid syntax is
// reported as a Zod issue at parse time.
const RegexString = z
  .string()
  .transform((val: string, ctx: z.RefinementCtx) => {
    try {
      return new RegExp(val)
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid regex: ${(e as Error).message}`
      })
      return z.NEVER
    }
  })

const ValidationConfigBase = z
  .object({
    fileNamePattern: RegexString.optional().describe(
      'Regex that every item file name (without extension) must match. ' +
        'Informational only; enforced by the linter, not by this library.'
    ),
    relationPattern: RegexString.optional().describe(
      'Anchored regex that every relation value must match in full. ' +
        'Capture group 1 must contain the relation target. Mutually ' +
        'exclusive with relationType.'
    ),
    relationType: z
      .enum(RELATION_TYPES)
      .optional()
      .describe(
        'Shorthand for relationPattern that selects a built-in pattern. ' +
          'Mutually exclusive with relationPattern.'
      )
  })
  .strict()

interface ValidationConfigInput {
  fileNamePattern?: RegExp
  relationPattern?: RegExp
  relationType?: (typeof RELATION_TYPES)[number]
}

const ValidationConfig = ValidationConfigBase.refine(
  (v: ValidationConfigInput) => !(v.relationPattern && v.relationType),
  {
    message: 'relationPattern and relationType are mutually exclusive',
    path: ['relationType']
  }
).transform((v: ValidationConfigInput) => ({
  fileNamePattern: v.fileNamePattern,
  // After transform, only relationPattern is exposed as a compiled RegExp.
  // The user's original intent (pattern or type) is collapsed into a single
  // effective RegExp.
  relationPattern:
    v.relationPattern ??
    (v.relationType ? RELATION_TYPE_PATTERNS[v.relationType] : undefined)
}))

export const WorkspaceConfigSchema = z
  .object({
    items: z
      .object({
        issue: z
          .string()
          .min(1)
          .optional()
          .describe('Path to the issue directory, workspace-relative.'),
        risk: z
          .string()
          .min(1)
          .optional()
          .describe('Path to the risk directory, workspace-relative.'),
        improvement: z
          .string()
          .min(1)
          .optional()
          .describe('Path to the improvement directory, workspace-relative.'),
        decision: z
          .string()
          .min(1)
          .optional()
          .describe('Path to the decision directory, workspace-relative.')
      })
      .strict()
      .describe('Mapping of item types to workspace-relative directory paths.'),
    include: z
      .array(z.string().min(1))
      .min(1)
      .describe(
        'Globs matched against file names (not full paths) in item ' +
          'directories. At least one entry required.'
      ),
    exclude: z
      .array(z.string().min(1))
      .default([])
      .describe(
        'Globs matched against file names (not full paths) to skip. ' +
          'Applied after include.'
      ),
    validation: ValidationConfig.default({}).describe(
      'Patterns consumed by external tools such as the linter; not ' +
        'enforced by this library.'
    )
  })
  .strict()

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>

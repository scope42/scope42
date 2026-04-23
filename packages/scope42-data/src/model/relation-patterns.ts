/**
 * Built-in anchored regex patterns, one per supported relation-link syntax.
 * A relation value must match the pattern in full; capture group 1 contains
 * the relation target. These are consumed by the linter; this library does
 * not apply them.
 */
export const RELATION_TYPES = [
  'markdown-link',
  'asciidoc-link',
  'obsidian-link'
] as const
export type RelationType = (typeof RELATION_TYPES)[number]

export const RELATION_TYPE_PATTERNS: Record<RelationType, RegExp> = {
  'markdown-link': /^\[[^\]]*\]\(([^)]+)\)$/,
  'asciidoc-link': /^<<(\S[^,>]*)(?:,[^>]*)?>>$/,
  'obsidian-link': /^\[\[([^|\]]+)(?:\|[^|\]]+)?\]\]$/
}

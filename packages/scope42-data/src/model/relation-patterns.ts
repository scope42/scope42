export const RELATION_TYPES = [
  'markdown-link',
  'asciidoc-link',
  'obsidian-link'
] as const
export type RelationType = (typeof RELATION_TYPES)[number]

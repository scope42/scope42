# @scope42/data — Frontmatter + Workspace Config Refactor

**Issue:** [#432](https://github.com/scope42/scope42/issues/432) (part of epic [#430](https://github.com/scope42/scope42/issues/430))
**Date:** 2026-04-19
**Branch:** `feat/data-frontmatter-refactor`

## Summary

Convert `packages/scope42-data` from a YAML-whole-file parser into a format-agnostic frontmatter extractor driven by a workspace config (`scope42.yaml`). The library stops modeling prose fields, stops constraining item IDs, and stops validating relation targets. Item files may use any text format that carries YAML frontmatter (Markdown, AsciiDoc, …). Item type is derived from the configured path; item ID is derived from the filename without extension.

## Motivation

Part of the scope42 pivot (#430) from a React PWA to an agent-native convention plus tools. `@scope42/data` must become a lean, shared schema/parser that the upcoming linter (#433), Obsidian plugin (#435), and agent skills (#436) can all consume. It must not hard-code directory structure or file format.

## Out of Scope

- Write APIs on `Workspace` (removed entirely — consumers assemble and write files themselves).
- Linter behavior (`validation.fileNamePattern`, `validation.relationPattern`) — stored in config but not enforced by the library. Implemented in #433.
- Migration of `app/example/` — the React app is removed in #434 and its example directory stays in place for now. A new `example/` at the repo root is created in this issue.
- Title extraction from body — the library treats the body as raw text. H1-as-title is a convention for other tools.

## Public API

### Loaded item shape

```ts
interface ItemBase<T extends ItemType, F> {
  id: string          // filename without extension
  type: T             // derived from the configured path the file lives in
  frontmatter: F      // Zod-parsed, type-specific
  body: string        // raw text after the frontmatter fence, not parsed
  filePath: string    // workspace-relative, e.g. "docs/issues/001 Foo.md"
}

export type Issue       = ItemBase<'issue', IssueFrontmatter>
export type Risk        = ItemBase<'risk', RiskFrontmatter>
export type Improvement = ItemBase<'improvement', ImprovementFrontmatter>
export type Decision    = ItemBase<'decision', DecisionFrontmatter>

export type Item = Issue | Risk | Improvement | Decision
```

### Workspace class

```ts
export class Workspace {
  constructor(public readonly rootDirectory: DirectoryHandle)
  async readConfig(): Promise<WorkspaceConfig>
  async readItems(): Promise<Item[]>
}
```

Removed: `writeConfig`, `writeItem`, `readItemsIndexed`.

## Workspace Config (`scope42.yaml`)

Filename changes from `scope42.yml` to `scope42.yaml`.

### Zod schema

```ts
// Parses a regex string and exposes a compiled RegExp. Invalid syntax is
// reported as a Zod issue at parse time.
const RegexString = z.string().transform((val, ctx) => {
  try { return new RegExp(val) } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid regex: ${(e as Error).message}`
    })
    return z.NEVER
  }
})

const RELATION_TYPES = ['markdown-link', 'asciidoc-link', 'obsidian-link'] as const

const RELATION_TYPE_PATTERNS: Record<typeof RELATION_TYPES[number], RegExp> = {
  'markdown-link': /\]\(([^)]+)\)/,
  'asciidoc-link': /<<([^,>]+)[,>]/,
  'obsidian-link': /\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/
}

const ValidationConfig = z.object({
  fileNamePattern: RegexString.optional()
    .describe(
      'Regex that every item file name (without extension) must match. ' +
      'Informational only; enforced by the linter, not by this library.'
    ),
  relationPattern: RegexString.optional()
    .describe(
      'Regex used by the linter to extract relation targets from relation ' +
      'values. Mutually exclusive with relationType. Capture group 1 must ' +
      'contain the relation target.'
    ),
  relationType: z.enum(RELATION_TYPES).optional()
    .describe(
      'Shorthand for relationPattern that selects a built-in pattern. ' +
      'Mutually exclusive with relationPattern.'
    )
}).refine(
  v => !(v.relationPattern && v.relationType),
  { message: 'relationPattern and relationType are mutually exclusive', path: ['relationType'] }
).transform(v => ({
  fileNamePattern: v.fileNamePattern,
  // After transform, only relationPattern is exposed as a compiled RegExp.
  // The user's original intent (pattern or type) is collapsed into a single
  // effective RegExp.
  relationPattern:
    v.relationPattern ??
    (v.relationType ? RELATION_TYPE_PATTERNS[v.relationType] : undefined)
}))

export const WorkspaceConfigSchema = z.object({
  items: z.object({
    issue:       z.string().min(1).optional().describe('Path to the issue directory, workspace-relative.'),
    risk:        z.string().min(1).optional().describe('Path to the risk directory, workspace-relative.'),
    improvement: z.string().min(1).optional().describe('Path to the improvement directory, workspace-relative.'),
    decision:    z.string().min(1).optional().describe('Path to the decision directory, workspace-relative.')
  }).strict().describe('Mapping of item types to workspace-relative directory paths.'),
  include: z.array(z.string().min(1)).min(1)
    .describe('Globs matched against file names (not full paths) in item directories. At least one entry required.'),
  exclude: z.array(z.string().min(1)).default([])
    .describe('Globs matched against file names (not full paths) to skip. Applied after include.'),
  validation: ValidationConfig.default({})
    .describe('Patterns consumed by external tools such as the linter; not enforced by this library.')
}).strict()

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>
```

### Example

```yaml
items:
  issue: docs/issues
  risk: docs/risks
  improvement: docs/improvements
  decision: docs/decisions
include: ["*.md"]
exclude: ["README.md"]
validation:
  fileNamePattern: "[0-9]{3} .+"
  relationType: markdown-link
```

### Rules

- `items` is a closed (strict) object keyed by the four fixed item types. Any key not in `{issue, risk, improvement, decision}` is a parse error.
- All four item-type keys are individually optional; a workspace may use only a subset.
- `include` is mandatory with at least one glob. Explicit is better than an implicit catch-all default.
- `exclude` defaults to `[]`.
- `validation` defaults to `{}` (all sub-fields undefined). `relationPattern` and `relationType` are mutually exclusive.
- Regex fields are compiled to `RegExp` at parse time (the transform surfaces Zod issues on invalid syntax). Consumers receive ready-to-use `RegExp` objects. For diagnostics, the source is available via `pattern.source`.

## Frontmatter Schemas

Located under `packages/scope42-data/src/model/`. All schemas use `.passthrough()` so unknown fields (e.g. Obsidian plugin metadata) are preserved rather than rejected.

### Common fields

```ts
// commons.ts
const CommonFrontmatter = {
  status: /* per type */,
  tags: z.array(z.string().min(1)).default([])
}

const RelationList = z.array(z.string().min(1)).default([])
```

`tags` preserves user order; no sorting, no deduplication.

### Per type

```ts
// issue.ts
export const IssueFrontmatterSchema = z.object({
  status: z.enum(['current', 'resolved', 'discarded']),
  tags: z.array(z.string().min(1)).default([]),
  causedBy: RelationList
}).passthrough()
export type IssueFrontmatter = z.infer<typeof IssueFrontmatterSchema>

// risk.ts
export const RiskFrontmatterSchema = z.object({
  status: z.enum(['potential', 'current', 'mitigated', 'discarded']),
  tags: z.array(z.string().min(1)).default([]),
  causedBy: RelationList
}).passthrough()

// improvement.ts
export const ImprovementFrontmatterSchema = z.object({
  status: z.enum(['proposed', 'accepted', 'implemented', 'discarded']),
  tags: z.array(z.string().min(1)).default([]),
  resolves: z.array(z.string().min(1)).min(1),
  modifies: RelationList,
  creates: RelationList
}).passthrough()

// decision.ts
export const DecisionFrontmatterSchema = z.object({
  status: z.enum(['proposed', 'accepted', 'deprecated', 'superseded', 'discarded']),
  tags: z.array(z.string().min(1)).default([]),
  supersededBy: z.string().min(1).optional(),
  assesses: RelationList,
  decided: z.coerce.date().optional()
}).passthrough()
```

`ticket` is **not** part of the schemas. Workspaces that currently carry it (e.g. the migrated `example/`) keep it in the frontmatter via the `.passthrough()` rule, which preserves unknown keys on the parsed object.

### Dropped

These are deleted (no deprecation shim):

- From frontmatter fields: `title`, `created`, `modified`, `comments`, `description`, `context`, `drivers`, `options` (with pros/cons), `outcome`, `deciders`. Those that carry content move to free body text during migration; the rest are simply dropped.
- Types/helpers: `IssueId`, `RiskId`, `ImprovementId`, `DecisionId` (all branded ID types and the regex-based parsers), `ItemId`, `Item()` helper, `NewItem`, `ItemFileContent`, `Tag`, `Comment`, `Aim42ItemType`, `DecisionOption`, `DecisionOutcome`, `DecisionFileContent`, `NewDecisionSchema`, `validateOutcomeExists`, `IssueFileContentSchema`, `NewIssueSchema`, and the equivalents for risk/improvement.
- `utils.getItemTypeFromId` (ID format is no longer prescribed). If `utils.ts` becomes empty, the file is deleted.

Relations as plain strings means the library does **not** constrain target formats. Users may put bare IDs (`issue-2`), Markdown links (`[title](path.md)`), Obsidian wikilinks (`[[issue-2]]`), or anything else. The linter decides what's valid via `validation.relationPattern` / `validation.relationType`.

## Workspace Loader Behavior

In `Workspace.readItems()`:

1. **Config** — read `scope42.yaml` from the workspace root; missing or invalid config throws with a descriptive message.
2. **For each configured item type:**
   - Resolve `items.<type>` against the workspace root. Missing directory throws.
   - Enumerate files in that directory (flat, non-recursive — matching today's behavior).
   - Filter by `include` then `exclude` globs. Globs match file names only, not full paths. Files not matching `include`, or matching `exclude`, are skipped silently.
   - For each surviving file: read text, run through `gray-matter`.
   - No frontmatter fence in the file → throw (with `filePath`). If the user included a file, it must be a scope42 item.
   - Validate parsed frontmatter with the type-specific Zod schema → Zod errors bubble up annotated with `filePath`.
   - Build `{ id, type, frontmatter, body, filePath }` where `id` is the filename without its last extension and `type` is the key from `items`.
3. **Return** a flat `Item[]`.

Cross-type duplicate IDs (e.g. `issues/001 X.md` and `risks/001 X.md`) are **not** a library error; the linter surfaces them.

### New dependencies

- `gray-matter` — format-agnostic frontmatter extraction.
- `picomatch` — glob matching for `include` / `exclude`.

Kept: `yaml`, `zod`. Nothing is removed from dependencies in this change.

## IO Adapters

The full adapter layer stays (node, fsa, virtual). Each implementation file gets a short header comment describing its purpose:

- `api.ts` — abstract `DirectoryHandle` / `FileHandle` interface all adapters implement.
- `node.ts` — Node.js `fs`/`path`-backed adapter. Used by the linter CLI and tests.
- `fsa.ts` — browser File System Access API adapter. Retained for potential future browser consumers; not used by current tools.
- `virtual.ts` — in-memory adapter used for unit tests.

No behavioral change. `workspace.ts` will target the `DirectoryHandle` interface as before.

## Tests

All under `packages/scope42-data/src/**/*.test.ts`. Jest + Node environment, as today.

1. **`model/workspace-config.test.ts`** — config parsing:
   - Minimal valid config parses.
   - Unknown top-level key rejected (`strict`).
   - Unknown key inside `items` rejected (`strict`).
   - Empty `include` rejected.
   - `relationPattern` and `relationType` together rejected.
   - `relationType` produces the matching built-in `RegExp` on the parsed `relationPattern` field.
   - `relationPattern` string is exposed as a compiled `RegExp`.
   - Invalid regex in `fileNamePattern` / `relationPattern` rejected with a clear message.
2. **`model/relation-patterns.test.ts`** — each built-in pattern:
   - Matches the expected link forms and captures the target.
   - Rejects malformed inputs.
   - Cases:
     - `markdown-link`: `[x](foo.md)` → `foo.md`; `[x](../a/b.md)` → `../a/b.md`; `[x]` → no match; plain text → no match.
     - `asciidoc-link`: `<<foo>>` → `foo`; `<<foo,Text>>` → `foo`; `<< >>` → no match.
     - `obsidian-link`: `[[issue-1]]` → `issue-1`; `[[issue-1|Alias]]` → `issue-1`; `[[a/b/c]]` → `a/b/c`; `[[]]` → no match; `[[a|b|c]]` → no match.
3. **`model/frontmatter-schemas.test.ts`** — per type:
   - Minimal valid frontmatter parses.
   - Defaults materialize (`tags`, relation arrays).
   - Invalid status enum rejected.
   - Missing required field rejected (e.g. `status`; improvement's `resolves` min 1).
   - Unknown fields (including `ticket`) **pass through** and appear on the parsed object.
   - Decision's `decided` accepts ISO string and round-trips to `Date`.
4. **`io/workspace.test.ts`** (rewrite, reusing the existing `testWs(content)` helper):
   - Workspace without `scope42.yaml` throws.
   - Workspace with invalid config throws with config error.
   - Workspace with only some item types configured: loader returns only those types.
   - Configured path missing in the tree throws.
   - `include` / `exclude` filters applied correctly.
   - File in `include` without frontmatter fence throws with `filePath`.
   - Frontmatter Zod error is annotated with `filePath`.
   - Happy path across all four types with Markdown bodies — verifies `id`, `type`, `frontmatter`, `body`, `filePath`.
   - Multi-format: a workspace with one `.md` and one `.adoc` item carrying identical frontmatter loads both with identical parsed frontmatter; body preserved verbatim in each.

## `FORMAT.md` (Repo Root)

New file describing the scope42 format and workspace config. Sections:

1. **Intro** — scope42 prescribes only frontmatter + workspace config. File format and directory layout are open.
2. **Workspace config (`scope42.yaml`)** — schema with mandatory/optional annotations, example, per-field semantics (`items`, `include`, `exclude`, `validation`).
3. **Item files** — frontmatter fence + body. Format-agnostic examples (`.md`, `.adoc`). ID = filename without extension. Type = configured path.
4. **Frontmatter — common fields** — `status`, `tags`. Passthrough rule for any additional user-defined fields.
5. **Frontmatter per type** — one subsection each for issue / risk / improvement / decision, listing status enums and relation fields with allowed target types (e.g. improvement `resolves` → issue or risk). Note that target *types* are conventional, not enforced by the library.
6. **Body** — free text. H1 title convention. Relations may appear as inline links or wikilinks; not validated by this library.
7. **Validation hints** — how tools like the linter use `validation.fileNamePattern` and `validation.relationPattern` / `validation.relationType`.

## Example Workspace (`example/`)

New directory at repo root. `app/example/` stays untouched (removed later in #434).

### Structure

```
example/
  scope42.yaml
  docs/
    issues/
      001 Frontend is hard to maintain.md
      002 <title>.md
      ...
    risks/
      001 <title>.md
      ...
    improvements/
      001 <title>.md
      ...
    decisions/
      001 Backend technology.md
      ...
```

Filename convention: `<three-digit number> <title>.md`. ID is therefore e.g. `001 Frontend is hard to maintain`.

### `scope42.yaml`

```yaml
items:
  issue: docs/issues
  risk: docs/risks
  improvement: docs/improvements
  decision: docs/decisions
include: ["*.md"]
exclude: ["README.md"]
validation:
  fileNamePattern: "[0-9]{3} .+"
  relationType: markdown-link
```

### Per-file migration rules

For each existing `app/example/**/*.yml` file:

- **Filename:** `<type>-<n>.yml` → `<zero-padded 3-digit n> <title>.md`. Example: `issue-1.yml` with `title: Frontend is hard to maintain` becomes `001 Frontend is hard to maintain.md`.
- **Frontmatter keeps:** `status`, `tags` (if any), and all relation arrays (`causedBy`, `resolves`, `modifies`, `creates`, `supersededBy`, `assesses`). Decision-only: `decided`. `ticket` is kept **as an extra passthrough field** (not part of the library schema) for every migrated file that has one.
- **Frontmatter drops:** `title`, `created`, `modified`, `comments`, `description`, `context`, `drivers`, `options`, `outcome`, `deciders`.
- **Relations rewritten as Markdown links:** each bare ID in a relation array is replaced with `[<target title>](<target new filename>)`. Example:
  ```yaml
  causedBy:
    - "[Unclear frontend ownership](002 Unclear frontend ownership.md)"
  ```
  Path is the target filename (same directory) or a relative path across directories (`../risks/001 …md`) when the relation targets a different type. Links are kept relative so they resolve in Obsidian, Markdown previewers, and static-site generators alike.
- **Body reconstruction:**
  - `# <title>` as H1.
  - Prose fields become body sections in this order when present:
    - `description` → leading paragraph(s) (no heading).
    - `context` → `## Context`.
    - `drivers` → `## Drivers`.
    - `options` → `## Options`, one `### <option title>` per entry with `description`, then `**Pros**` and `**Cons**` bullet lists.
    - `outcome` → `## Outcome`. First line names the chosen option (`**Chosen option:** <title of options[optionIndex]>`), then the rationale as paragraph, then `**Positive consequences**` / `**Negative consequences**` sub-lists.
    - `deciders` → `## Deciders` bullet list.
    - `comments` → `## Comments`, one entry per comment with author and timestamp line.
- **`scope42.lock` is not migrated** — it's app-runtime state, irrelevant to the new library.
- The legacy `export.ts` and `README.md` in `app/example/` are not migrated.

## `@scope42/data` README

Replace the current one-line README with:

- One-paragraph description of the package (schemas + workspace loader for the scope42 format).
- Code example, importing `NodeDirectoryHandle` from its adapter entry point (matching `examples/data-processing`):
  ```ts
  import { Workspace } from '@scope42/data'
  import { NodeDirectoryHandle } from '@scope42/data/dist/io/adapters/node'

  const workspace = new Workspace(new NodeDirectoryHandle('./my-workspace'))
  const items = await workspace.readItems()
  console.log(items)
  ```
- Link to `FORMAT.md` for schema/semantics details.

## `examples/data-processing`

The existing code already uses `Workspace` + `NodeDirectoryHandle`. It stays structurally identical but points to the new `example/` at the repo root (path adjusts from `../../app/example` to `../../example`). No API breakage visible in the example because `Workspace.readItems()` still exists; its return shape changes (new `Item` union), which is fine for a console dump.

## Breaking Changes

Everything in this package is a breaking change. The package is versioned `0.0.0` and has no downstream consumers outside this monorepo (verified against the parent epic, which plans to consume it via linter/plugin/skills built *after* this refactor). No deprecation shims.

## Verification Plan

- `npm run build` and `npm test` pass for `packages/scope42-data`.
- `npm --workspace examples/data-processing run gen` pointed at the new `example/` workspace prints items for all four types.
- Example workspace contains at least one `.md` item per type, with migrated frontmatter and reconstructed body.
- `FORMAT.md` covers every field in the shipped schemas (cross-check by hand).

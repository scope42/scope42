# scope42 Format

scope42 prescribes two things: a small **YAML frontmatter** on each item file, and a **workspace config** that tells tools where items live. Everything else — file format, directory layout, prose structure — is up to you.

## Workspace config (`scope42.yaml`)

A single file at the workspace root. Tools refuse to operate without it.

```yaml
version: 2
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

### Fields

- **`version`** (required) — must be `2`. Tools reject configs with a missing or different version.
- **`items`** (required) — mapping of item types to workspace-relative directory paths. Valid keys: `issue`, `risk`, `improvement`, `decision`. All are individually optional; unknown keys are rejected.
- **`include`** (required, non-empty) — array of globs matched against **file names** (not full paths) inside the configured directories. Only matching files are considered scope42 items.
- **`exclude`** (optional, default `[]`) — globs applied after `include` to drop files.
- **`validation`** (optional) — patterns consumed by external tools like the linter. Not enforced by `@scope42/data`.
  - **`fileNamePattern`** — regex that every item file name (without extension) must match.
  - **`relationPattern`** / **`relationType`** — mutually exclusive. `relationType` selects a built-in pattern: `markdown-link` (matches `[text](target)`), `asciidoc-link` (matches `<<target>>` or `<<target,text>>`), or `obsidian-link` (matches `[[target]]` or `[[target|alias]]`). All built-in patterns are anchored — a relation value must match in full, and capture group 1 is the target.

## Item files

Each file has YAML frontmatter between `---` delimiters, followed by a body of free text:

```markdown
---
status: current
tags: [frontend]
---

# Frontend is hard to maintain

Body prose here.
```

- **ID** — the filename without its last extension.
- **Type** — derived from which configured directory the file lives in.
- **Title** — by convention, the first `H1` in the body (`# …` in Markdown, `= …` in AsciiDoc). Not part of frontmatter.

Any text file format that carries YAML frontmatter works: Markdown, AsciiDoc, or anything else.

## Frontmatter — common fields

- **`status`** (required) — typed per item type (see below).
- **`tags`** (optional, array of strings) — free-form tags.

Additional keys are preserved on the parsed object (passthrough). Tools may attach their own metadata (e.g. an Obsidian plugin, a `ticket` URL, etc.) without breaking validation.

## Frontmatter — per item type

### Issue

- `status`: `current` | `resolved` | `discarded`
- `causedBy` (optional, default `[]`): array of relation strings. Convention: other issues.

### Risk

- `status`: `potential` | `current` | `mitigated` | `discarded`
- `causedBy` (optional, default `[]`): array of relation strings. Convention: issues.

### Improvement

- `status`: `proposed` | `accepted` | `implemented` | `discarded`
- `resolves` (required, non-empty): array of relation strings. Convention: issues or risks.
- `modifies` (optional, default `[]`): array of relation strings. Convention: risks.
- `creates` (optional, default `[]`): array of relation strings. Convention: risks.

### Decision

- `status`: `proposed` | `accepted` | `deprecated` | `superseded` | `discarded`
- `supersededBy` (optional): single relation string. Convention: another decision.
- `assesses` (optional, default `[]`): array of relation strings. Convention: improvements.
- `decided` (optional): ISO date string; exposed to consumers as a `Date`.
- `deciders` (optional, default `[]`): array of strings naming the people or groups who made the decision.

Target *types* for relations are conventional — `@scope42/data` stores relation values as plain strings and does not validate the target. The linter (when present) uses the workspace's `validation` config to check link syntax and resolve targets.

## Body

The body is free text. Relation values in frontmatter typically use the same syntax as body links — Markdown (`[text](path)`), AsciiDoc (`<<target,text>>`), or Obsidian wikilinks (`[[target]]`). Which one you use is a workspace-level choice, declared via `validation.relationType`.

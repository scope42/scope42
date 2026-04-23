# @scope42/data

Schemas and a workspace loader for the [scope42 format](../../FORMAT.md). The loader reads a `scope42.yaml` workspace config, enumerates configured item directories, parses YAML frontmatter out of every matching file, and exposes items as a discriminated union of `Issue | Risk | Improvement | Decision`.

The library is format-agnostic: it doesn't care whether items are `.md`, `.adoc`, or anything else — any text file carrying YAML frontmatter is supported. Bodies are returned as raw text and never parsed.

## Usage

```ts
import { Workspace } from '@scope42/data'
import { NodeDirectoryHandle } from '@scope42/data/dist/io/adapters/node'

const workspace = new Workspace(new NodeDirectoryHandle('./my-workspace'))
const items = await workspace.readItems()
console.log(items)
```

See [FORMAT.md](../../FORMAT.md) for the workspace config schema and per-type frontmatter fields.

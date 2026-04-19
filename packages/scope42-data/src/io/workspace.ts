import matter from 'gray-matter'
import picomatch from 'picomatch'
import YAML from 'yaml'
import {
  DecisionFrontmatterSchema,
  ImprovementFrontmatterSchema,
  IssueFrontmatterSchema,
  Item,
  ItemType,
  RiskFrontmatterSchema,
  WorkspaceConfig,
  WorkspaceConfigSchema
} from '../model'
import { DirectoryHandle, FileHandle } from './adapters/api'

const WORKSPACE_CONFIG_FILE = 'scope42.yaml'

type FrontmatterSchema =
  | typeof IssueFrontmatterSchema
  | typeof RiskFrontmatterSchema
  | typeof ImprovementFrontmatterSchema
  | typeof DecisionFrontmatterSchema

const SCHEMA_BY_TYPE: Record<ItemType, FrontmatterSchema> = {
  issue: IssueFrontmatterSchema,
  risk: RiskFrontmatterSchema,
  improvement: ImprovementFrontmatterSchema,
  decision: DecisionFrontmatterSchema
}

export class Workspace {
  constructor(public readonly rootDirectory: DirectoryHandle) {}

  async readConfig(): Promise<WorkspaceConfig> {
    let file: FileHandle
    try {
      file = await this.rootDirectory.resolveFile(WORKSPACE_CONFIG_FILE)
    } catch (e) {
      throw new Error(
        `Could not find ${WORKSPACE_CONFIG_FILE} in workspace root`
      )
    }
    const text = await file.readText()
    const raw = YAML.parse(text)
    const result = WorkspaceConfigSchema.safeParse(raw)
    if (!result.success) {
      throw new Error(
        `Invalid ${WORKSPACE_CONFIG_FILE}: ${result.error.message}`
      )
    }
    return result.data
  }

  async readItems(): Promise<Item[]> {
    const config = await this.readConfig()
    const isIncluded = makeFilter(config.include, config.exclude)
    const items: Item[] = []

    for (const [type, path] of Object.entries(config.items) as [
      ItemType,
      string | undefined
    ][]) {
      if (!path) continue
      const dir = await resolveDirByPath(this.rootDirectory, path)
      for await (const entry of dir.getContent()) {
        if (entry.kind !== 'file') continue
        if (!isIncluded(entry.name)) continue
        const filePath = `${path}/${entry.name}`
        items.push(await parseItem(entry, type, filePath))
      }
    }

    return items
  }
}

function makeFilter(
  include: string[],
  exclude: string[]
): (name: string) => boolean {
  const includeMatch = picomatch(include)
  const excludeMatch = exclude.length > 0 ? picomatch(exclude) : () => false
  return name => includeMatch(name) && !excludeMatch(name)
}

async function resolveDirByPath(
  root: DirectoryHandle,
  relPath: string
): Promise<DirectoryHandle> {
  const segments = relPath.split('/').filter(Boolean)
  let current = root
  for (const segment of segments) {
    try {
      current = await current.resolveDirectory(segment)
    } catch (e) {
      throw new Error(`Configured path does not exist: ${relPath}`)
    }
  }
  return current
}

async function parseItem(
  file: FileHandle,
  type: ItemType,
  filePath: string
): Promise<Item> {
  const text = await file.readText()
  const parsed = matter(text)
  // gray-matter returns `data: {}` when the file has no frontmatter block at
  // all; that's an authoring error for a configured item directory.
  if (Object.keys(parsed.data).length === 0) {
    throw new Error(`No frontmatter in ${filePath}`)
  }
  const schema = SCHEMA_BY_TYPE[type]
  const result = schema.safeParse(parsed.data)
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${filePath}: ${result.error.message}`
    )
  }
  const id = stripExtension(file.name)
  // The cast below is safe because schema selection is keyed by `type`; each
  // branch produces the correctly-typed frontmatter for that item type.
  return {
    id,
    type,
    frontmatter: result.data,
    body: parsed.content,
    filePath
  } as Item
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(0, dot) : name
}

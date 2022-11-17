import {
  DecisionSchema,
  DecisionId,
  ImprovementSchema,
  ImprovementId,
  IssueSchema,
  IssueId,
  Item,
  ItemId,
  IndexedItems,
  ItemType,
  RiskSchema,
  RiskId,
  WorkspaceConfig
} from '../model'
import { getItemTypeFromId } from '../utils'
import { DirectoryHandle, FileHandle } from './adapters/api'
import YAML from 'yaml'

const WORKSPACE_CONFIG_FILE = 'scope42.yml'

const ITEM_DIRECTORIES: Record<ItemType, string> = {
  issue: 'issues',
  improvement: 'improvements',
  risk: 'risks',
  decision: 'decisions'
}

export class Workspace {
  constructor(public readonly rootDirectory: DirectoryHandle) {}

  async readConfig(): Promise<WorkspaceConfig> {
    const file = await this.rootDirectory.resolveFile(WORKSPACE_CONFIG_FILE)
    const fileContent = await file.readText()
    return WorkspaceConfig.parse(YAML.parse(fileContent))
  }

  async writeConfig(config: WorkspaceConfig) {
    const file = await this.rootDirectory.resolveOrCreateFile(
      WORKSPACE_CONFIG_FILE
    )
    return file.writeText(YAML.stringify(config))
  }

  async readItems(): Promise<Item[]> {
    const items: Item[][] = await Promise.all([
      parseItemsInDirectory(
        this.rootDirectory,
        ITEM_DIRECTORIES.issue,
        IssueId,
        IssueSchema
      ),
      parseItemsInDirectory(
        this.rootDirectory,
        ITEM_DIRECTORIES.improvement,
        ImprovementId,
        ImprovementSchema
      ),
      parseItemsInDirectory(
        this.rootDirectory,
        ITEM_DIRECTORIES.risk,
        RiskId,
        RiskSchema
      ),
      parseItemsInDirectory(
        this.rootDirectory,
        ITEM_DIRECTORIES.decision,
        DecisionId,
        DecisionSchema
      )
    ])

    return items.flat(1)
  }

  async readItemsIndexed(): Promise<IndexedItems> {
    const items = await this.readItems()

    return items.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {} as IndexedItems
    )
  }

  async writeItem(item: Item) {
    const type = getItemTypeFromId(item.id)
    const dir = await this.rootDirectory.resolveOrCreateDirectory(
      ITEM_DIRECTORIES[type]
    )
    const file = await dir.resolveOrCreateFile(item.id + '.yml')
    const existingContent = await file.readText()
    const merged =
      existingContent === ''
        ? item
        : { ...YAML.parse(existingContent), ...item }
    return file.writeText(YAML.stringify(merged))
  }
}

interface Parser<T> {
  parse(data: unknown): T
}

async function parseItemsInDirectory<ITEM extends Item, ID extends ItemId>(
  workspaceDir: DirectoryHandle,
  itemDirName: string,
  idParser: Parser<ID>,
  itemParser: Parser<ITEM>
): Promise<ITEM[]> {
  let dir: DirectoryHandle
  try {
    dir = await workspaceDir.resolveDirectory(itemDirName)
  } catch (e) {
    return [] // if the directory does not exist, that's okay
  }
  const promises: Promise<ITEM>[] = []

  for await (const entry of dir.getContent()) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.yml')) {
      break
    }
    promises.push(parseItemFile(entry, idParser, itemParser))
  }

  return Promise.all(promises)
}

async function parseItemFile<ITEM extends Item, ID extends ItemId>(
  file: FileHandle,
  idParser: Parser<ID>,
  itemParser: Parser<ITEM>
): Promise<ITEM> {
  try {
    const id = idParser.parse(file.name.slice(0, -4)) // omit ".yml"
    const type = getItemTypeFromId(id)
    const fileContent = YAML.parse(await file.readText())
    const item = itemParser.parse({ id, type, ...fileContent })
    return item
  } catch (error) {
    throw new Error(`Parsing '${file.name}' failed: ${error}`)
  }
}

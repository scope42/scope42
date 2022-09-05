import { AppState, Items } from './store'
import {
  Decision,
  DecisionId,
  Improvement,
  ImprovementId,
  Issue,
  IssueId,
  Item,
  ItemId,
  ItemType,
  Risk,
  RiskId
} from './types'
import YAML from 'yaml'
import { message } from 'antd'
import { getTypeFromId } from './util'

const DIRECTORIES: Record<ItemType, string> = {
  issue: 'issues',
  improvement: 'improvements',
  risk: 'risks',
  decision: 'decisions'
}

export async function writeYaml(
  fileHandle: FileSystemFileHandle,
  data: object
) {
  return await writeFile(fileHandle, YAML.stringify(data, {}))
}

export async function writeFile(
  fileHandle: FileSystemFileHandle,
  contents: FileSystemWriteChunkType
) {
  try {
    const writable = await fileHandle.createWritable()
    await writable.truncate(0) // override exsiting data
    await writable.write(contents)
    await writable.close()
  } catch (error) {
    message.error(`${error}`)
    throw error
  }
}

export async function writeItem(
  workspaceDir: FileSystemDirectoryHandle | undefined,
  item: Item
) {
  if (!workspaceDir) {
    return // this is allowed in demo mode
  }
  await verifyLock(workspaceDir)
  const dir = await workspaceDir.getDirectoryHandle(DIRECTORIES[item.type], {
    create: true
  })
  const file = await dir.getFileHandle(`${item.id}.yml`, { create: true })
  const { id, type, ...fileContent } = item
  await writeYaml(file, fileContent)
}

export async function writeWorkspaceReadme(
  dirHandle: FileSystemDirectoryHandle
) {
  const fileHandle = await dirHandle.getFileHandle('README.md', {
    create: true
  })
  await writeFile(
    fileHandle,
    `
# scope42 Workspace

This directory contains data for scope42, a web-based tool for software architecture improvement.
Click the link below and open this directory as a workspace.

## 🔗 [scope42](${window.location.origin})

<!-- This file is generated once when creating a workspace to give others a hint what is contained in this diretory. Feel free to edit or delete this. -->
`
  )
}

interface Parser<T> {
  parse(data: unknown): T
}

export async function loadItems(
  workspaceDir: FileSystemDirectoryHandle
): Promise<Pick<AppState, 'items'>> {
  await claimLock(workspaceDir)
  const items = await Promise.all([
    parseItemsInDirectory(workspaceDir, 'issues', IssueId, Issue),
    parseItemsInDirectory(
      workspaceDir,
      'improvements',
      ImprovementId,
      Improvement
    ),
    parseItemsInDirectory(workspaceDir, 'risks', RiskId, Risk),
    parseItemsInDirectory(workspaceDir, 'decisions', DecisionId, Decision)
  ])

  return {
    items: {
      ...items[0],
      ...items[1],
      ...items[2],
      ...items[3]
    }
  }
}

async function parseItemsInDirectory<ITEM extends Item, ID extends ItemId>(
  workspaceDir: FileSystemDirectoryHandle,
  itemDirName: string,
  idParser: Parser<ID>,
  itemParser: Parser<ITEM>
): Promise<Items> {
  let dir: FileSystemDirectoryHandle
  try {
    dir = await workspaceDir.getDirectoryHandle(itemDirName)
  } catch {
    return {} // if the directory does not exist, that's okay
  }

  const promises: Promise<ITEM>[] = []

  for await (const entry of dir.values()) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.yml')) {
      break
    }
    promises.push(parseItemFile(entry, idParser, itemParser))
  }

  const results = await Promise.all(promises)
  return results.reduce(
    (items, result) => ({ ...items, [result.id]: result }),
    {} as Record<ID, ITEM>
  )
}

async function parseItemFile<ITEM extends Item, ID extends ItemId>(
  fileHandle: FileSystemFileHandle,
  idParser: Parser<ID>,
  itemParser: Parser<ITEM>
): Promise<ITEM> {
  try {
    const file = await fileHandle.getFile()
    const id = idParser.parse(file.name.slice(0, -4)) // omit ".yml"
    const type = getTypeFromId(id)
    const fileContent = YAML.parse(await file.text())
    const item = itemParser.parse({ id, type, ...fileContent })
    return item
  } catch (error) {
    throw new Error(`Parsing '${fileHandle.name}' failed: ${error}`)
  }
}

//@ts-ignore
const instanceId = typeof crypto !== 'undefined' ? crypto.randomUUID() : 'local'

const LOCK_FILE = 'scope42.lock'
const LOCK_CONTENT = `# This lock file is created to prevevent concurrent writes to the workspace.
# You should check this into version control to get notified of incoming changes.
${instanceId}`

export class LockError extends Error {}

async function verifyLock(workspaceDir: FileSystemDirectoryHandle) {
  if (true) {
    return // Locking is currently disabled, see https://github.com/scope42/scope42/issues/186
  }
  let fileHandle: FileSystemFileHandle
  try {
    fileHandle = await workspaceDir.getFileHandle(LOCK_FILE)
  } catch {
    // if the file has been deleted in the meantime, re-create it gracefully
    claimLock(workspaceDir)
    return
  }

  const file = await fileHandle.getFile()
  const fileContent = await file.text()

  if (fileContent !== LOCK_CONTENT) {
    throw new LockError()
  }
}

async function claimLock(workspaceDir: FileSystemDirectoryHandle) {
  if (true) {
    return // Locking is currently disabled, see https://github.com/scope42/scope42/issues/186
  }
  const fileHandle = await workspaceDir.getFileHandle(LOCK_FILE, {
    create: true
  })
  writeFile(fileHandle, LOCK_CONTENT)
}

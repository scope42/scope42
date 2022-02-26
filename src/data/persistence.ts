import { AppState } from './store'
import {
  Improvement,
  ImprovementId,
  Issue,
  IssueId,
  Risk,
  RiskId
} from './types'
import YAML from 'yaml'
import { message } from 'antd'

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
  itemDirName: string,
  id: string,
  item: object
) {
  if (!workspaceDir) {
    return // this is allowed in demo mode
  }
  const dir = await workspaceDir.getDirectoryHandle(itemDirName, {
    create: true
  })
  const file = await dir.getFileHandle(`${id}.yml`, { create: true })
  await writeYaml(file, item)
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
): Promise<Pick<AppState, 'issues' | 'improvements' | 'risks'>> {
  const items = await Promise.all([
    parseItemsInDirectory(workspaceDir, 'issues', IssueId, Issue),
    parseItemsInDirectory(
      workspaceDir,
      'improvements',
      ImprovementId,
      Improvement
    ),
    parseItemsInDirectory(workspaceDir, 'risks', RiskId, Risk)
  ])

  return {
    issues: items[0],
    improvements: items[1],
    risks: items[2]
  }
}

async function parseItemsInDirectory<ITEM>(
  workspaceDir: FileSystemDirectoryHandle,
  itemDirName: string,
  idType: Parser<string>,
  itemType: Parser<ITEM>
): Promise<Record<string, ITEM>> {
  let dir: FileSystemDirectoryHandle
  try {
    dir = await workspaceDir.getDirectoryHandle(itemDirName)
  } catch {
    return {} // if the directory does not exist, that's okay
  }

  const promises: Promise<{ id: string; item: ITEM }>[] = []

  for await (const entry of dir.values()) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.yml')) {
      break
    }
    promises.push(parseItemFile(entry, idType, itemType))
  }

  const results = await Promise.all(promises)
  return results.reduce(
    (items, result) => ({ ...items, [result.id]: result.item }),
    {} as Record<string, ITEM>
  )
}

async function parseItemFile<ITEM>(
  fileHandle: FileSystemFileHandle,
  idType: Parser<string>,
  itemType: Parser<ITEM>
): Promise<{ id: string; item: ITEM }> {
  try {
    const file = await fileHandle.getFile()
    const id = idType.parse(file.name.slice(0, -4)) // omit ".yml"
    const item = itemType.parse(YAML.parse(await file.text()))
    return { id, item }
  } catch (error) {
    throw new Error(`Parsing '${fileHandle.name}' failed: ${error}`)
  }
}

import create, { GetState, SetState } from 'zustand'
import produce from 'immer'
import {
  Improvement,
  ImprovementId,
  Issue,
  IssueId,
  Item,
  ItemId,
  ItemType,
  Risk,
  RiskId,
  WorkspaceConfig
} from './types'
import { getIdFromSerial, getSerialFromId } from './util'
import {
  loadItems,
  LockError,
  writeItem,
  writeWorkspaceReadme,
  writeYaml
} from './persistence'
import { Modal } from 'antd'

export type Items = Partial<
  Record<IssueId, Issue> &
    Record<ImprovementId, Improvement> &
    Record<RiskId, Risk>
>

export interface AppState {
  items: Items
  workspace: {
    present: boolean
    name?: string
    handle?: FileSystemDirectoryHandle
    loading?: boolean
    error?: unknown
  }
  createWorkspace: (dirHandle: FileSystemDirectoryHandle) => Promise<void>
  openWorkspace: (dirHandle: FileSystemDirectoryHandle) => Promise<void>
  openDemoWorkspace: () => void
  closeWorkspace: () => void
  loadExampleData: () => Promise<void>
  createItem: (item: Omit<Item, 'id'>) => Promise<ItemId>
  updateItem: (item: Item) => Promise<void>
}

const INITIAL_STATE: Pick<AppState, 'workspace' | 'items'> = {
  workspace: { present: false },
  items: {}
}

export const useStore = create<AppState>((set, get) => ({
  ...INITIAL_STATE,
  createWorkspace: async dirHandle => {
    const configFileHandle = await dirHandle.getFileHandle('scope42.yml', {
      create: true
    })
    await writeYaml(configFileHandle, WorkspaceConfig.parse({}))
    await writeWorkspaceReadme(dirHandle)
    await get().openWorkspace(dirHandle)
  },
  openWorkspace: async dirHandle => {
    set({ workspace: { present: false, loading: true } })
    try {
      set(await loadItems(dirHandle))
    } catch (error) {
      set({ workspace: { present: false, error } })
      return
    }
    set({
      workspace: { present: true, name: dirHandle.name, handle: dirHandle }
    })
  },
  openDemoWorkspace: () => {
    set({ workspace: { present: true, name: 'Demo' } })
  },
  closeWorkspace: () => {
    set(INITIAL_STATE)
  },
  loadExampleData: async () => {
    const { EXAMPLE_DATA } = await import('./example')
    set(EXAMPLE_DATA)
  },
  createItem: async item => {
    const id = getNextId(get(), item.type)
    const newItem = { ...item, id } as Item
    await tryWriteItem(set, get, newItem)
    set(
      produce(state => {
        state.items[id] = newItem
      })
    )
    return id
  },
  updateItem: async item => {
    const updatedItem = { ...item, modified: new Date() }
    await tryWriteItem(set, get, updatedItem)
    set(
      produce(state => {
        state.items[item.id] = updatedItem
      })
    )
  }
}))

async function tryWriteItem(
  set: SetState<AppState>,
  get: GetState<AppState>,
  item: Item
) {
  const workspaceHandle = get().workspace.handle
  try {
    await writeItem(workspaceHandle, item)
  } catch (error) {
    if (error instanceof LockError) {
      Modal.error({
        title: 'Workspace is stale',
        content: `The workspace has been written to from another scope42 instance.
           If you did open it in another tab, you may want to close this one.
           If you got incoming changes from someone else, you need to reload the workspace.`,
        closable: false,
        okText: 'Reload workspace',
        onOk: () => {
          get().closeWorkspace()
          get().openWorkspace(workspaceHandle!!)
        }
      })
      throw error
    }
  }
}

function getNextId(state: AppState, itemType: ItemType): ItemId {
  const existingIds = selectAllItems(state)
    .filter(i => i.type === itemType)
    .map(i => i.id)

  if (existingIds.length === 0) {
    return getIdFromSerial(1, itemType)
  }
  const highestExistingId = Math.max(...existingIds.map(getSerialFromId))
  return getIdFromSerial(highestExistingId + 1, itemType)
}

export const selectAllItems = (state: Pick<AppState, 'items'>) =>
  Object.values(state.items) as Item[]

export const selectAllTags = (state: Pick<AppState, 'items'>) =>
  [...new Set(selectAllItems(state).flatMap(i => i.tags))].sort()

export const selectAllIssues = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter((i): i is Issue => i.type === 'issue')

export const selectAllImprovements = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter(
    (i): i is Improvement => i.type === 'improvement'
  )

export const selectAllRisks = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter((i): i is Risk => i.type === 'risk')

export const selectAllPersonNames = (state: AppState) => [
  ...new Set(
    selectAllItems(state)
      .flatMap(i => i.comments)
      .map(c => c.author)
  )
]

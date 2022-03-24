import create from 'zustand'
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
  writeItem,
  writeWorkspaceReadme,
  writeYaml
} from './persistence'

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
    await writeItem(get().workspace.handle, newItem)
    set(
      produce(state => {
        state.items[id] = newItem
      })
    )
    return id
  },
  updateItem: async item => {
    const updatedItem = { ...item, modified: new Date() }
    await writeItem(get().workspace.handle, updatedItem)
    set(
      produce(state => {
        state.items[item.id] = updatedItem
      })
    )
  }
}))

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

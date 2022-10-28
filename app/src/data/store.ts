import create from 'zustand'
import produce from 'immer'
import {
  Decision,
  getItemIdFromSerial,
  getSerialFromItemId,
  Improvement,
  IndexedItems,
  Issue,
  Item,
  ItemId,
  ItemType,
  Risk,
  Workspace
} from '@scope42/data'
import {
  addToSearchIndex,
  resetSearchIndex,
  updateSearchIndex
} from '../features/search'
import { message } from 'antd'

type WorkspaceState =
  | {
      present: false
      loading?: boolean
      error?: unknown
    }
  | {
      present: true
      access: Workspace
      name: string
    }

export interface AppState {
  items: IndexedItems
  workspace: WorkspaceState
  openWorkspace: (workspace: Workspace) => Promise<void>
  closeWorkspace: () => void
  createItem: (item: Omit<Item, 'id'>) => Promise<ItemId>
  updateItem: (item: Item) => Promise<void>
}

const INITIAL_STATE: Pick<AppState, 'workspace' | 'items'> = {
  workspace: { present: false },
  items: {}
}

export const useStore = create<AppState>((set, get) => ({
  ...INITIAL_STATE,
  openWorkspace: async workspace => {
    set({ workspace: { present: false, loading: true } })
    try {
      const items = { items: await workspace.readItemsIndexed() }
      set(items)
      selectAllItems(items).forEach(addToSearchIndex) // don't await
    } catch (error) {
      set({ workspace: { present: false, error } })
      return
    }
    set({
      workspace: {
        present: true,
        name: workspace.rootDirectory.name,
        access: workspace
      }
    })
  },
  closeWorkspace: () => {
    set(INITIAL_STATE)
    resetSearchIndex()
  },
  createItem: async item => {
    const id = getNextId(get(), item.type)
    const newItem = { ...item, id } as Item
    await requireAccess(get().workspace)
      .writeItem(newItem)
      .catch(displayErrorAndRethrow)
    set(
      produce(state => {
        state.items[id] = newItem
      })
    )
    addToSearchIndex(newItem) // don't await
    return id
  },
  updateItem: async item => {
    const updatedItem = { ...item, modified: new Date() }
    await requireAccess(get().workspace)
      .writeItem(updatedItem)
      .catch(displayErrorAndRethrow)
    set(
      produce(state => {
        state.items[item.id] = updatedItem
      })
    )
    updateSearchIndex(updatedItem) // don't await
  }
}))

function requireAccess(worspaceState: WorkspaceState) {
  if (worspaceState.present) {
    return worspaceState.access
  }
  throw new Error('Workspace is not present')
}

function displayErrorAndRethrow(error: any): never {
  message.error(`${error}`)
  throw error
}

function getNextId(state: AppState, itemType: ItemType): ItemId {
  const existingIds = selectAllItems(state)
    .filter(i => i.type === itemType)
    .map(i => i.id)

  if (existingIds.length === 0) {
    return getItemIdFromSerial(1, itemType)
  }
  const highestExistingId = Math.max(...existingIds.map(getSerialFromItemId))
  return getItemIdFromSerial(highestExistingId + 1, itemType)
}

export const selectAllItems = (state: Pick<AppState, 'items'>) =>
  Object.values(state.items) as Item[]

export const selectAllTags = (state: Pick<AppState, 'items'>) =>
  [...new Set(selectAllItems(state).flatMap(i => i.tags))].sort()

export const selectAllIssues = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter((i): i is Issue => i.type === 'issue')

export const selectAllDecisions = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter((i): i is Decision => i.type === 'decision')

export const selectAllImprovements = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter(
    (i): i is Improvement => i.type === 'improvement'
  )

export const selectAllRisks = (state: Pick<AppState, 'items'>) =>
  selectAllItems(state).filter((i): i is Risk => i.type === 'risk')

export const selectAllPersonNames = (state: AppState) => [
  ...new Set([
    ...selectAllItems(state)
      .flatMap(i => i.comments)
      .map(c => c.author),
    ...selectAllDecisions(state).flatMap(d => d.deciders)
  ])
]

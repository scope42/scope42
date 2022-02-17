import create from 'zustand'
import produce from 'immer'
import { Improvement, ImprovementId, Issue, IssueId, ItemId, Risk, RiskId, WorkspaceConfig } from './types'
import { getNumericId } from './util'
import { loadItems, writeItem, writeWorkspaceReadme, writeYaml } from './persistence'

export interface AppState {
  issues: Record<IssueId, Issue>;
  risks: Record<RiskId, Risk>;
  improvements: Record<ImprovementId, Improvement>;
  workspace: {
    present: boolean,
    name?: string,
    handle?: FileSystemDirectoryHandle
    loading?: boolean,
    error?: unknown
  }
  createWorkspace: (dirHandle: FileSystemDirectoryHandle) => Promise<void>
  openWorkspace: (dirHandle: FileSystemDirectoryHandle) => Promise<void>
  openDemoWorkspace: () => void,
  closeWorkspace: () => void,
  loadExampleData: () => Promise<void>,
  updateIssue: (id: IssueId, issue: Issue) => Promise<void>;
  createIssue: (issue: Issue) => Promise<IssueId>;
}

export const useStore = create<AppState>((set, get) => ({
  workspace: { present: false },
  issues: {},
  risks: {},
  improvements: {},
  createWorkspace: async dirHandle => {
    const configFileHandle = await dirHandle.getFileHandle("scope42.yml", { create: true })
    await writeYaml(configFileHandle, WorkspaceConfig.parse({}))
    await writeWorkspaceReadme(dirHandle)
    await get().openWorkspace(dirHandle)
  },
  openWorkspace: async dirHandle => {
    set({ workspace: { present: false, loading: true } })
    try {
      set(await loadItems(dirHandle))
    } catch(error) {
      set({workspace: { present: false, error }})
      return
    }
    set({ workspace: { present: true, name: dirHandle.name, handle: dirHandle } })
  },
  openDemoWorkspace: () => {
    set({ workspace: { present: true, name: "Demo" }})
  },
  closeWorkspace: () => {
    set({ workspace: { present: false } })
  },
  loadExampleData: async () => {
    const { EXAMPLE_DATA } = await import("./example")
    set(EXAMPLE_DATA)
  },
  updateIssue: async (id, issue) => {
    const updatedIssue = {...issue, modified: new Date() }
    await writeItem(get().workspace.handle, "issues", id, updatedIssue)
    set(produce(state => { state.issues[id] = updatedIssue }))
  },
  createIssue: async (issue) => {
    const id = `issue-${getNextId(Object.keys(get().issues))}`
    await writeItem(get().workspace.handle, "issues", id, issue)
    set(produce(state => { state.issues[id] = issue }))
    return id
  },
}))

function getNextId(existingIds: ItemId[]) {
  if (existingIds.length === 0) {
    return 1
  }
  const highestExistingId = Math.max(...(existingIds.map(getNumericId)))
  return highestExistingId + 1
}

export const selectAllItems = (state: AppState) => [...Object.values(state.issues), ...Object.values(state.improvements), ...Object.values(state.risks)]

export const selectAllTags = (state: AppState) => [...new Set(selectAllItems(state).flatMap(i => i.tags))].sort()
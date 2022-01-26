import create from 'zustand'
import produce from 'immer'
import { Improvement, ImprovementId, Issue, IssueId, Risk, RiskId } from './types'
import { getNumericId } from './util'

export interface AppState {
  issues: Record<IssueId, Issue>;
  risks: Record<RiskId, Risk>;
  improvements: Record<ImprovementId, Improvement>;
  updateIssue: (id: IssueId, issue: Issue) => void;
  createIssue: (issue: Issue) => IssueId;
}

export const useStore = create<AppState>((set, get) => ({
  issues: {
    'issue-1': Issue.parse({ title: 'Issue 1', body: 'Das ist ein Test', tags: ["frontend"] }),
    'issue-2': Issue.parse({ title: 'Issue 2', body: 'Das ist ein Test', cause: 'issue-1', tags: ["backend"] }),
    'issue-3': Issue.parse({ title: 'Issue 3', body: 'Das ist ein Test', cause: 'issue-2', tags: ["backend", "urgent"] }),
  },
  risks: {
    'risk-1': Risk.parse({ title: 'Risk 1', body: 'Das ist ein Test' }),
    'risk-2': Risk.parse({ title: 'Risk 1', body: 'Das ist ein Test' }),
  },
  improvements: {
    'improvement-1': Improvement.parse({ title: 'Improvement 1', body: 'Das ist ein Test', solves: [] }),
    'improvement-2': Improvement.parse({ title: 'Improvement 2', body: 'Das ist ein Test', solves: ['issue-1'] }),
    'improvement-3': Improvement.parse({ title: 'Improvement 3', body: 'Das ist ein Test', solves: ['issue-2', 'issue-3'] }),
    'improvement-4': Improvement.parse({ title: 'Improvement 4', body: 'Das ist ein Test', solves: ['issue-2'] }),
    'improvement-5': Improvement.parse({ title: 'Improvement 5', body: 'Das ist ein Test', solves: ['issue-2'] }),
    'improvement-6': Improvement.parse({ title: 'Improvement 6', body: 'Das ist ein Test', solves: ['issue-2'] }),
  },
  updateIssue: (id, issue) => set(produce(state => {
    state.issues[id] = {...issue, modified: new Date() }
  })),
  createIssue: (issue) => {
    const id = "issue-" + (Math.max(...(Object.keys(get().issues).map(getNumericId))) + 1)
    set(produce(state => {
      state.issues[id] = issue
    }))
    return id
  },
}))

export const selectAllItems = (state: AppState) => [...Object.values(state.issues), ...Object.values(state.improvements), ...Object.values(state.risks)]

export const selectAllTags = (state: AppState) => [...new Set(selectAllItems(state).flatMap(i => i.tags))].sort()
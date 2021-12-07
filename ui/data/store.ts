import create from 'zustand'
import produce from 'immer'
import { Issue } from '.'

export interface AppState {
  issues: Issue[];
  createIssue: (issue: Issue) => void;
}

export const useStore = create<AppState>(set => ({
  issues: [
    { id: '1', title: 'Issue 1', body: 'Das ist ein Test' },
    { id: '2', title: 'Issue 2', body: 'Das ist ein Test', cause: '1' },
    { id: '3', title: 'Issue 3', body: 'Das ist ein Test', cause: '2' },
  ],
  createIssue: issue => set(produce(state => {
    state.issues.push(issue)
  })),
}))

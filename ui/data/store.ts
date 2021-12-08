import create from 'zustand'
import produce from 'immer'
import { EntityId, Improvement, Issue, Risk } from '.'

export interface AppState {
  issues: Record<EntityId, Issue>;
  risks: Record<EntityId, Risk>;
  improvements: Record<EntityId, Improvement>;
  updateIssue: (id: entityId, issue: Issue) => void;
}

export const useStore = create<AppState>(set => ({
  issues: {
    is1: { title: 'Issue 1', body: 'Das ist ein Test' },
    is2: { title: 'Issue 2', body: 'Das ist ein Test', cause: 'is1' },
    is3: { title: 'Issue 3', body: 'Das ist ein Test', cause: 'is2' },
  },
  risks: {
    r1: { title: 'Risk 1', body: 'Das ist ein Test' },
    r2: { title: 'Risk 1', body: 'Das ist ein Test' },
  },
  improvements: {
    im1: { title: 'Improvement 1', body: 'Das ist ein Test', solves: [] },
    im2: { title: 'Improvement 2', body: 'Das ist ein Test', solves: ['is1'] },
    im3: { title: 'Improvement 3', body: 'Das ist ein Test', solves: ['is2', 'is3'] },
    im4: { title: 'Improvement 4', body: 'Das ist ein Test', solves: ['is2'] },
    im5: { title: 'Improvement 5', body: 'Das ist ein Test', solves: ['is2'] },
    im6: { title: 'Improvement 6', body: 'Das ist ein Test', solves: ['is2'] },
  },
  updateIssue: (id, issue) => set(produce(state => {
    state.issues[id] = issue
  })),
}))

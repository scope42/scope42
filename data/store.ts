import create from 'zustand'
import produce from 'immer'
import { Improvement, ImprovementId, Issue, IssueId, Risk, RiskId } from './types'
import Item from 'antd/lib/list/Item'

export interface AppState {
  issues: Record<IssueId, Issue>;
  risks: Record<RiskId, Risk>;
  improvements: Record<ImprovementId, Improvement>;
  updateIssue: (id: IssueId, issue: Issue) => void;
}

export const useStore = create<AppState>(set => ({
  issues: {
    'issue-1': Issue.parse({ title: 'Issue 1', body: 'Das ist ein Test' }),
    'issue-2': Issue.parse({ title: 'Issue 2', body: 'Das ist ein Test', cause: 'issue-1' }),
    'issue-3': Issue.parse({ title: 'Issue 3', body: 'Das ist ein Test', cause: 'issue-2' }),
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
    state.issues[id] = issue
  })),
}))

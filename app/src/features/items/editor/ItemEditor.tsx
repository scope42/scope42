import create from 'zustand'
import { DecisionId, ImprovementId, IssueId, RiskId } from '@scope42/data'
import { DecisionEditor } from './DecisionEditor'
import { ImprovementEditor } from './ImprovementEditor'
import { IssueEditor } from './IssueEditor'
import { RiskEditor } from './RiskEditor'

interface EditorState {
  current:
    | null
    | { type: 'issue'; id?: IssueId }
    | { type: 'improvement'; id?: ImprovementId }
    | { type: 'risk'; id?: RiskId }
    | { type: 'decision'; id?: DecisionId }
  createIssue: () => void
  createImprovement: () => void
  createRisk: () => void
  createDecision: () => void
  editIssue: (id: IssueId) => void
  editImprovement: (id: ImprovementId) => void
  editRisk: (id: RiskId) => void
  editDecision: (id: DecisionId) => void
  closeEditor: () => void
}

export const useEditorStore = create<EditorState>(set => ({
  current: null,
  createIssue: () => set({ current: { type: 'issue' } }),
  createImprovement: () => set({ current: { type: 'improvement' } }),
  createRisk: () => set({ current: { type: 'risk' } }),
  createDecision: () => set({ current: { type: 'decision' } }),
  editIssue: id => set({ current: { type: 'issue', id } }),
  editImprovement: id => set({ current: { type: 'improvement', id } }),
  editRisk: id => set({ current: { type: 'risk', id } }),
  editDecision: id => set({ current: { type: 'decision', id } }),
  closeEditor: () => set({ current: null })
}))

export const ItemEditor: React.FC = () => {
  const current = useEditorStore(state => state.current)

  if (current?.type === 'issue') {
    return <IssueEditor issueId={current.id} />
  }

  if (current?.type === 'improvement') {
    return <ImprovementEditor improvementId={current.id} />
  }

  if (current?.type === 'risk') {
    return <RiskEditor riskId={current.id} />
  }

  if (current?.type === 'decision') {
    return <DecisionEditor decisionId={current.id} />
  }

  return null
}

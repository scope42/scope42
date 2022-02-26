import create from 'zustand'
import { ImprovementId, IssueId, RiskId } from '../../data/types'
import { ImprovementEditor } from './ImprovementEditor'
import { IssueEditor } from './IssueEditor'
import { RiskEditor } from './RiskEditor'

interface EditorState {
  current:
    | null
    | { type: 'issue'; id?: IssueId }
    | { type: 'improvement'; id?: ImprovementId }
    | { type: 'risk'; id?: RiskId }
  createIssue: () => void
  createImprovement: () => void
  createRisk: () => void
  editIssue: (id: IssueId) => void
  editImprovement: (id: ImprovementId) => void
  editRisk: (id: RiskId) => void
  closeEditor: () => void
}

export const useEditorStore = create<EditorState>(set => ({
  current: null,
  createIssue: () => set({ current: { type: 'issue' } }),
  createImprovement: () => set({ current: { type: 'improvement' } }),
  createRisk: () => set({ current: { type: 'risk' } }),
  editIssue: id => set({ current: { type: 'issue', id } }),
  editImprovement: id => set({ current: { type: 'improvement', id } }),
  editRisk: id => set({ current: { type: 'risk', id } }),
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

  return null
}

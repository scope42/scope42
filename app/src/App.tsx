import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { WorkspaceSelection } from './features/workspace'
import { useStore } from './data/store'
import { Error404 } from './features/ui'
import ImprovementsPage from './pages/ImprovementsPage'
import IssuesPage from './pages/IssuesPage'
import IssuePage from './pages/IssuePage'
import RisksPage from './pages/RisksPage'
import RiskPage from './pages/RiskPage'
import ImprovementPage from './pages/ImprovementPage'
import { AboutPage } from './pages/AboutPage'
import { IntroductionPage } from './pages/introduction'
import DecisionsTablePage from './pages/decisions-table'
import DecisionDetailsPage from './pages/decision-details'
import SearchPage from './pages/search'
import { DefaultLayout } from './features/layout'

const App: React.FC = () => {
  const workspacePresent = useStore(state => state.workspace.present)

  if (!workspacePresent) {
    return <WorkspaceSelection />
  }

  return (
    <Router>
      <DefaultLayout>
        <Routes>
          <Route index element={<IntroductionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/issues/:id" element={<IssuePage />} />
          <Route path="/improvements" element={<ImprovementsPage />} />
          <Route path="/improvements/:id" element={<ImprovementPage />} />
          <Route path="/risks" element={<RisksPage />} />
          <Route path="/risks/:id" element={<RiskPage />} />
          <Route path="/decisions" element={<DecisionsTablePage />} />
          <Route path="/decisions/:id" element={<DecisionDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </DefaultLayout>
    </Router>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { WorkspaceSelection } from './features/workspace'
import { useStore } from './data/store'
import { Error404 } from './features/ui'
import ImprovementsTablePage from './pages/improvements-table'
import IssuesTablePage from './pages/issues-table'
import IssueDetailsPage from './pages/issue-details'
import RisksTablePage from './pages/risks-table'
import RiskDetailsPage from './pages/risk-details'
import ImprovementDetailsPage from './pages/improvement-details'
import { AboutPage } from './pages/about'
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
          <Route path="/issues" element={<IssuesTablePage />} />
          <Route path="/issues/:id" element={<IssueDetailsPage />} />
          <Route path="/improvements" element={<ImprovementsTablePage />} />
          <Route
            path="/improvements/:id"
            element={<ImprovementDetailsPage />}
          />
          <Route path="/risks" element={<RisksTablePage />} />
          <Route path="/risks/:id" element={<RiskDetailsPage />} />
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

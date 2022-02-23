import { Divider, Layout, Typography } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ItemEditor } from './components/ItemEditor/ItemEditor';
import { WorkspaceSelection } from './components/WorkspaceSelection';
import { useStore } from './data/store';
import HomePage from './pages/HomePage';
import Error404 from './components/Error404';
import ImprovementsPage from './pages/ImprovementsPage';
import IssuesPage from './pages/IssuesPage';
import IssuePage from './pages/IssuePage';
import RisksPage from './pages/RisksPage';
import RiskPage from './pages/RiskPage';
import ImprovementPage from './pages/ImprovementPage';
import { BugOutlined, GithubOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout

const App: React.VFC = () => {
  const workspacePresent = useStore(state => state.workspace.present)

  if (!workspacePresent) {
    return <WorkspaceSelection />
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100%' }}>
        <Header />
        <ItemEditor />
        <Content style={{ backgroundColor: 'white', padding: '50px 50px' }}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/issues/:id" element={<IssuePage />} />
            <Route path="/improvements" element={<ImprovementsPage />} />
            <Route path="/improvements/:id" element={<ImprovementPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/risks/:id" element={<RiskPage />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Version 0.0.0 <Divider type='vertical' />
          <GithubOutlined /> <a target="_blank" href='https://github.com/erikhofer/scope42' rel="noreferrer noopener">Source Code</a> <Divider type='vertical' />
          <BugOutlined /> <a target="_blank" href='https://github.com/erikhofer/scope42/issues' rel="noreferrer noopener">Report Issue</a> <Divider type='vertical' />
          <Typography.Text type="secondary">Not affiliated with aim42.</Typography.Text>
        </Footer>
      </Layout> 
    </Router>
  );
}

export default App;
import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ItemEditor } from './components/ItemEditor/ItemEditor';
import { WorkspaceSelection } from './components/WorkspaceSelection';
import { useStore } from './data/store';
import HomePage from './pages';
import Error404 from './pages/404';
import ImprovementsPage from './pages/improvements';
import IssuesPage from './pages/issues';
import IssuePage from './pages/issues/[id]';
import RisksPage from './pages/risks';

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
            <Route path="/risks" element={<RisksPage />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        TODO
        </Footer>
      </Layout> 
    </Router>
  );
}

export default App;

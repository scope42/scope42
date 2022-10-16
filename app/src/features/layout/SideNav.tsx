import { HomeOutlined, SearchOutlined } from '@ant-design/icons'
import { Menu, Layout } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  DecisionIcon,
  ImprovementIcon,
  IssueIcon,
  RiskIcon
} from '../../components/ItemIcon'

export const SideNav: React.FC = () => {
  const location = useLocation()

  const basePath = '/' + location.pathname.split('/')[1]
  return (
    <Layout.Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 24
        }}
      >
        <img
          src={process.env.PUBLIC_URL + '/logo_small_white.svg'}
          alt="scope42"
          width={48.005852 * 3}
          height={9.3873901 * 3}
        />
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[basePath]}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Introduction</Link>
        </Menu.Item>
        <Menu.Item key="/issues" icon={<IssueIcon />}>
          <Link to="/issues">Issues</Link>
        </Menu.Item>
        <Menu.Item key="/improvements" icon={<ImprovementIcon />}>
          <Link to="/improvements">Improvements</Link>
        </Menu.Item>
        <Menu.Item key="/risks" icon={<RiskIcon />}>
          <Link to="/risks">Risks</Link>
        </Menu.Item>
        <Menu.Item key="/decisions" icon={<DecisionIcon />}>
          <Link to="/decisions">Decisions</Link>
        </Menu.Item>
        <Menu.Item key="/search" icon={<SearchOutlined />}>
          <Link to="/search">Search</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  )
}

import { Button, Layout, Menu, Popover } from 'antd'
import styles from './Header.module.css'
import { AddItemButton } from './AddItemButton'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useStore } from '../data/store'
import { Link, useLocation } from 'react-router-dom'
import { HeaderSearch } from '../features/search'

export const Header: React.FC = () => {
  const location = useLocation()
  const workspaceName = useStore(state => state.workspace.name)
  const closeWorkspace = useStore(state => state.closeWorkspace)

  const basePath = '/' + location.pathname.split('/')[1]

  const workspacePopover = (
    <>
      <p>
        <b>{workspaceName}</b>
      </p>
      <Button type="primary" icon={<LogoutOutlined />} onClick={closeWorkspace}>
        Close
      </Button>
    </>
  )

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.left}>
        <img
          src={process.env.PUBLIC_URL + '/logo_small_white.svg'}
          alt="scope42"
          width={48.005852 * 3}
          height={9.3873901 * 3}
        />
        <div style={{ width: 32 }}></div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[basePath]}
          style={{ width: 500 }}
        >
          <Menu.Item key="/">
            <Link to="/">Introduction</Link>
          </Menu.Item>
          <Menu.Item key="/issues">
            <Link to="/issues">Issues</Link>
          </Menu.Item>
          <Menu.Item key="/improvements">
            <Link to="/improvements">Improvements</Link>
          </Menu.Item>
          <Menu.Item key="/risks">
            <Link to="/risks">Risks</Link>
          </Menu.Item>
          <Menu.Item key="/decisions">
            <Link to="/decisions">Decisions</Link>
          </Menu.Item>
          <Menu.Item key="/search">
            <Link to="/search">Search</Link>
          </Menu.Item>
        </Menu>
      </div>
      <AddItemButton />
      <div className={styles.right}>
        <HeaderSearch />
        <Popover
          placement="bottomRight"
          title="Workspace"
          content={workspacePopover}
          trigger="click"
        >
          <SettingOutlined style={{ fontSize: '24px', color: 'white' }} />
        </Popover>
      </div>
    </Layout.Header>
  )
}

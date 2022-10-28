import { Button, Layout, Popover } from 'antd'
import styles from './Header.module.css'
import { AddItemButton } from './AddItemButton'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useStore } from '../../data/store'
import { HeaderSearch } from '../search'

export const Header: React.FC = () => {
  const workspaceName = useStore(state =>
    state.workspace.present ? state.workspace.name : ''
  )
  const closeWorkspace = useStore(state => state.closeWorkspace)

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
      <div>{/* to keep the AddItemButton in the center */}</div>
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

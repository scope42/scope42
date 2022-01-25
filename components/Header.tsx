import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import { Dropdown, Input, Layout, Menu } from "antd"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../styles/Header.module.css"
import Button from "antd-button-color"
import { ImprovementIcon, IssueIcon, RiskIcon } from "./ItemIcon"

const addMenu = (
  <Menu>
    <Menu.Item icon={<IssueIcon />}>
      <span style={{marginLeft: 8}}>Issue</span>
    </Menu.Item>
    <Menu.Item icon={<ImprovementIcon />}>
      <span style={{marginLeft: 8}}>Improvement</span>
    </Menu.Item>
    <Menu.Item icon={<RiskIcon />}>
      <span style={{marginLeft: 8}}>Risk</span>
    </Menu.Item>
  </Menu>
)

export const Header: React.FC = () => {
  const router = useRouter()
  
  return <Layout.Header className={styles.header}>
    <div className={styles.left}>
      <div className={styles.logo} />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[router.pathname]}>
        <Menu.Item key="/"><Link href="/">Dashboard</Link></Menu.Item>
        <Menu.Item key="/issues"><Link href="/issues">Issues</Link></Menu.Item>
      </Menu>
    </div>
    <Dropdown overlay={addMenu} placement="bottomCenter" trigger={['click']}>
      <Button type="success" shape="circle" size="large" icon={<PlusOutlined />} />
    </Dropdown>
    <Input.Search placeholder="Search" onSearch={() => {}} size="large" style={{width: 300}} enterButton disabled />
  </Layout.Header>
}
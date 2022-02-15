import { Input, Layout, Menu } from "antd"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../styles/Header.module.css"
import { AddIconButton } from "./AddItemButton"
import Image from 'next/image'

export const Header: React.FC = () => {
  const router = useRouter()
  
  return <Layout.Header className={styles.header}>
    <div className={styles.left}>
      <Image src="/logo_small_white.svg" alt="scope42" width={48.005852 * 3} height={9.3873901 * 3} />
      <div style={{ width: 32 }}></div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[router.pathname]} style={{width: 400}}>
        <Menu.Item key="/"><Link href="/">Dashboard</Link></Menu.Item>
        <Menu.Item key="/issues"><Link href="/issues">Issues</Link></Menu.Item>
        <Menu.Item key="/improvements"><Link href="/improvements">Improvements</Link></Menu.Item>
        <Menu.Item key="/risks"><Link href="/risks">Risks</Link></Menu.Item>
      </Menu>
    </div>
    <AddIconButton />
    <Input.Search placeholder="Search" onSearch={() => {}} size="large" style={{width: 300}} enterButton disabled />
  </Layout.Header>
}
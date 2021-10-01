import 'antd/dist/antd.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'

const { Header, Content, Footer } = Layout

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>scope42</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout className="layout" style={{ minHeight: '100%' }}>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[router.pathname]}>
            <Menu.Item key="/"><Link href="/">Dashboard</Link></Menu.Item>
            <Menu.Item key="/issues"><Link href="/issues">Issues</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ backgroundColor: 'white', padding: '50px 50px' }}>
          <div className="site-layout-content"><Component {...pageProps} /></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        TODO
        </Footer>
      </Layout>
    </>
  )
}

export default MyApp

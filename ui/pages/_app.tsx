import 'antd/dist/antd.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

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

import { GithubOutlined } from '@ant-design/icons'
import { Divider, Layout } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from '../ui'
import { ItemEditor } from '../items'
import { Header } from './Header'
import { SideNav } from './SideNav'

export const DefaultLayout: React.FC<{ children: React.ReactNode }> = props => {
  return (
    <Layout style={{ minHeight: '100%' }} hasSider>
      <SideNav />
      <Layout style={{ marginLeft: 200 }}>
        <Header />
        <ItemEditor />
        <Layout.Content
          style={{ backgroundColor: 'white', padding: '50px 50px' }}
        >
          {props.children}
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Version {process.env.REACT_APP_VERSION} <Divider type="vertical" />
          <Link to="/about">About</Link>
          <Divider type="vertical" />
          <GithubOutlined />{' '}
          <ExternalLink noIcon url="https://github.com/scope42/scope42">
            GitHub
          </ExternalLink>
        </Layout.Footer>
      </Layout>
    </Layout>
  )
}

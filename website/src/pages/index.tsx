import React from 'react'
import Layout from '@theme/Layout'
import Logo from '@site/static/img/logo_full.svg'
import Link from '@docusaurus/Link'
import { AwesomeButton } from 'react-awesome-button'
import 'react-awesome-button/dist/styles.css'

export default function LandingPage() {
  return (
    <Layout
      title="Welcome"
      description="Welcome to scope42 - the CMS for software architecture documentation"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
          flexDirection: 'column',
          gap: 32
        }}
      >
        <Logo
          width={296.382 * 2}
          height={56.768 * 2}
          style={{
            filter: 'drop-shadow(0px 0px 1px rgba(255, 255, 255, 1))'
          }}
        />
        <p>
          Welcome to scope42 - the CMS for software architecture documentation!
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          <AwesomeButton type="secondary" size="large" href="/docs">
            📖 Docs
          </AwesomeButton>
          <AwesomeButton
            size="large"
            type="primary"
            href="https://app.scope42.org"
          >
            🚀 App
          </AwesomeButton>
        </div>
      </div>
    </Layout>
  )
}

function Button(props: { title: string; description: string; to: string }) {
  return (
    <Link to={props.to}>
      <div
        style={{
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 'var(--ifm-pagination-nav-border-radius)',
          lineHeight: 'var(--ifm-heading-line-height)',
          padding: 'var(--ifm-global-spacing)'
        }}
      >
        <div>{props.title}</div>
      </div>
    </Link>
  )
}

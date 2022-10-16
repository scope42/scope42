import { BugOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { ExternalLink } from '../features/ui'
import { PageHeader } from '../components/PageHeader'
import { Aim42Attribution } from '../features/aim42'

export const AboutPage: React.FC = () => {
  return (
    <>
      <PageHeader title="About" />
      <div style={{ maxWidth: 630, margin: '0 auto' }}>
        <img
          src={process.env.PUBLIC_URL + '/logo.svg'}
          alt="scope42 logo"
          width={78.417763 * 8}
          height={15.01984 * 8}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            margin: '32px 0'
          }}
        >
          <h2>Version {process.env.REACT_APP_VERSION}</h2>
          <ExternalLink url="https://github.com/scope42/scope42/issues" noIcon>
            <Button icon={<BugOutlined />}>Report Issue</Button>
          </ExternalLink>
        </div>
        <p>
          scope42 is published under the{' '}
          <ExternalLink url="https://github.com/scope42/scope42/blob/main/LICENSE">
            GNU General Public License v3.0
          </ExternalLink>
          . The source code can be found in the{' '}
          <ExternalLink url="https://github.com/scope42/scope42">
            GitHub Repsoitory
          </ExternalLink>
          .
        </p>
        <p>
          The data model and basic concepts are based on the{' '}
          <Aim42Attribution />.
        </p>
        <p>scope42 is not affiliated with aim42.</p>
      </div>
    </>
  )
}

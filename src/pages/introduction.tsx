import React from 'react'
import { Aim42SectionCard } from '../features/aim42'
import { Narrow } from '../features/ui'
import { howDoesAim42WorkAtomic } from '@scope42/structured-aim42/lib/introduction/how-does-aim42-work/atomic'
import { Alert, Avatar, Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { useStore } from '../data/store'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from '../components/ExternalLink'

const { Title } = Typography

export const IntroductionPage: React.VFC = () => {
  const demoMode = useStore(state => state.workspace.handle === undefined)
  const loadExampleData = useStore(state => state.loadExampleData)
  const navigate = useNavigate()

  return (
    <Narrow>
      <PageHeader title="Introduction" />
      <div style={{ display: 'flex', marginBottom: 32 }}>
        <img
          src={process.env.PUBLIC_URL + '/welcome.svg'}
          alt="Welcome"
          width={613.35286 * 0.5}
          height={700.56123 * 0.5}
        />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 24
          }}
        >
          <Title level={2}>Welcome to scope42 ✨</Title>
          <p>
            Use the top navigation to explore <b>issues</b>, <b>improvements</b>{' '}
            and <b>risks</b> in this workspace.
          </p>
          <p>
            To add new items, use the{' '}
            <Avatar
              size="small"
              style={{ backgroundColor: '#28a745' }}
              icon={<PlusOutlined />}
            />{' '}
            button at the top of the screen.
          </p>
        </div>
      </div>
      {demoMode ? (
        <Alert
          message="Demo Mode"
          description={
            <>
              You opened scope42 in demo mode. You can play around in it but no
              data is persisted. <br /> Want to get an idea of how aim42 items
              could look like?{' '}
              <Button
                type="primary"
                onClick={() =>
                  loadExampleData().then(() => navigate('/issues'))
                }
              >
                Load example data
              </Button>
            </>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Title level={2}>New to aim42?</Title>
      <p>
        If you have not worked with aim42 yet, it is recommended to take a look
        at the{' '}
        <ExternalLink url={'https://aim42.github.io/'}>
          Method Reference
        </ExternalLink>
        . The following is a brief introduction.
      </p>
      <Aim42SectionCard section={howDoesAim42WorkAtomic} />
    </Narrow>
  )
}

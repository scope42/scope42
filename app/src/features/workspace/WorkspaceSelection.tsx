import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Modal, Row } from 'antd'
import { useStore } from '../../data/store'
import 'liquid-loading'
import { ExternalLink } from '../ui'
import { DemoWorkspace } from '../demo'
import { Workspace } from '@scope42/data'
import { FsaDirectoryHandle } from '@scope42/data/dist/io/adapters/fsa'
import { initializeWorkspace } from './initialization'

export const WorkspaceSelection: React.FC = () => {
  const workspace = useStore(state => state.workspace)
  const openWorkspace = useStore(state => state.openWorkspace)

  if (workspace.present === true) {
    return null
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div>
          <img
            src={process.env.PUBLIC_URL + '/logo.svg'}
            alt="scope42 logo"
            width={78.417763 * 8}
            height={15.01984 * 8}
          />
          <h2 style={{ textAlign: 'center' }}>
            Improve your software architecture with precision!
          </h2>
        </div>
        <div>
          This tool helps you to keep track of issues, arising risks and
          possible improvements of your existing architecture. The terminology
          and concepts are based on aim42, the Architecture Improvement Method.
        </div>
        <Card title="Workspace" style={{ width: '100%' }}>
          <Row>
            <Col span={12}>
              <img
                src={process.env.PUBLIC_URL + '/workspace.svg'}
                alt="Improvement"
                width={777.00073 * 0.5}
                height={407.99846 * 0.5}
              />
            </Col>
            <Col span={12}>
              {workspace.loading ? (
                <Loading />
              ) : (
                <>
                  <p>
                    To ensure your data ownership, scope42 stores all data in an
                    open file format on your machine. Click the button below to
                    choose a directory that is used as the workspace root.
                  </p>
                  {workspace.error ? (
                    <>
                      <Alert
                        type="error"
                        message="Opening workspace failed"
                        description={`${workspace.error}`}
                      />
                      <br />
                    </>
                  ) : null}
                  <DirectoryPicker />
                </>
              )}
            </Col>
          </Row>
        </Card>
        <Button
          block
          type="primary"
          ghost
          onClick={() => openWorkspace(new DemoWorkspace())}
          disabled={workspace.loading}
        >
          Open Demo (no data persistence)
        </Button>
      </div>
    </div>
  )
}

const Loading: React.FC = () => {
  // @ts-ignore
  return <liquid-loading />
}

const DirectoryPicker: React.FC = () => {
  const browserSupported = window.showDirectoryPicker !== undefined

  const openWorkspace = useStore(state => state.openWorkspace)

  const chooseWorkspace = async () => {
    const dirHandle = await window.showDirectoryPicker()

    const workspace = new Workspace(new FsaDirectoryHandle(dirHandle))

    const isInitialized = await workspace
      .readConfig()
      .then(() => true)
      .catch(() => false)

    if (isInitialized) {
      await openWorkspace(workspace)
    } else {
      Modal.confirm({
        title: 'Create new workspace?',
        icon: <ExclamationCircleOutlined />,
        content:
          'The selected directory is a scope42 workspace yet. Do you want to create a new workspace here? This should only be done in empty directories to avoid loss of existing data!',
        onOk: () =>
          initializeWorkspace(workspace).then(() => openWorkspace(workspace))
      })
    }
  }

  if (!browserSupported) {
    return (
      <Alert
        message={
          <>
            Your browser does not support access to the local file system yet.
            You can still try the demo but not persist any data.
            <br />
            <ExternalLink url="https://caniuse.com/native-filesystem-api">
              List of supported browsers
            </ExternalLink>
          </>
        }
        type="error"
      ></Alert>
    )
  }

  return (
    <Button type="primary" onClick={chooseWorkspace}>
      Choose Workspace
    </Button>
  )
}

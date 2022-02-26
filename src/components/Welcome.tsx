import { PlusOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import { useStore } from '../data/store'

export const Welcome: React.VFC = () => {
  const demoMode = useStore(state => state.workspace.handle === undefined)
  const loadExampleData = useStore(state => state.loadExampleData)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24
      }}
    >
      <img
        src={process.env.PUBLIC_URL + '/welcome.svg'}
        alt="Welcome"
        width={613.35286 * 0.65}
        height={700.56123 * 0.65}
      />
      <h2>Welcome to scope42!</h2>
      <p>
        You did not create any items yet. Use the{' '}
        <Avatar
          size="small"
          style={{ backgroundColor: '#28a745' }}
          icon={<PlusOutlined />}
        />{' '}
        button at the top of the screen to get started!
      </p>
      {demoMode ? (
        <Button type="primary" onClick={loadExampleData}>
          Load example data
        </Button>
      ) : null}
    </div>
  )
}

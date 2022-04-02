import { FullscreenOutlined } from '@ant-design/icons'
import { Card, Modal, Switch } from 'antd'
import { useState } from 'react'
import { Item } from '../../data/types'
import { Graph } from './Graph'

export const GraphCard: React.VFC<{
  items: Item[]
  alwaysShowRelatedItems?: boolean
}> = props => {
  const { items, alwaysShowRelatedItems } = props
  const [expanded, setExpanded] = useState(false)
  const [showRelatedItems, setShowRelatedItems] = useState(false)

  return (
    <>
      <Card
        actions={[
          <FullscreenOutlined onClick={() => setExpanded(true)} key="expand" />
        ]}
      >
        <Graph
          items={items}
          preview
          showRelatedItems={alwaysShowRelatedItems || showRelatedItems}
        />
      </Card>
      <Modal
        visible={expanded}
        onCancel={() => setExpanded(false)}
        destroyOnClose={false}
        footer={null}
        width="80vw"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch
            checked={alwaysShowRelatedItems || showRelatedItems}
            onChange={setShowRelatedItems}
            disabled={alwaysShowRelatedItems}
          />{' '}
          Show related items
        </div>
        <Graph
          items={items}
          showRelatedItems={alwaysShowRelatedItems || showRelatedItems}
        />
      </Modal>
    </>
  )
}

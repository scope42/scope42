import { FullscreenOutlined } from '@ant-design/icons'
import { Card, CardProps, Modal, Switch } from 'antd'
import { useState } from 'react'
import { Item } from '../../data/types'
import { Graph } from './Graph'

interface GraphCardProps extends CardProps {
  items: Item[]
  alwaysShowRelatedItems?: boolean
}

export const GraphCard: React.FC<GraphCardProps> = props => {
  const { items, alwaysShowRelatedItems, ...cardProps } = props
  const [expanded, setExpanded] = useState(false)
  const [showRelatedItems, setShowRelatedItems] = useState(false)

  return (
    <>
      <Card
        {...cardProps}
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

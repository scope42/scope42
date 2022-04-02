import { Col, Row } from 'antd'
import { useState } from 'react'
import { GraphCard } from '../../graphs'
import { ItemsTable, ItemsTableProps } from './ItemsTable'

interface ItemsTablePageProps extends ItemsTableProps {}

export const ItemsTablePage: React.VFC<ItemsTablePageProps> = props => {
  const { id, items, possibleStatuses, defaultVisibleStatuses } = props
  const [filteredItems, setFilteredItems] = useState(items)
  return (
    <Row gutter={16}>
      <Col span={18}>
        <ItemsTable
          id={id}
          items={items}
          possibleStatuses={possibleStatuses}
          defaultVisibleStatuses={defaultVisibleStatuses}
          onFilter={setFilteredItems}
        />
      </Col>
      <Col span={6}>
        <GraphCard items={filteredItems} />
      </Col>
    </Row>
  )
}

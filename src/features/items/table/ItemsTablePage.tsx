import { Col, Row } from 'antd'
import { useMemo } from 'react'
import { GraphCard } from '../../graphs'
import { ItemsTable, ItemsTableProps } from './ItemsTable'
import { useTablesStore } from './store'

interface ItemsTablePageProps extends ItemsTableProps {}

export const ItemsTablePage: React.VFC<ItemsTablePageProps> = props => {
  const { id, items, possibleStatuses, defaultVisibleStatuses } = props

  // To be able to synchronize the table and graph, we have to do the filtering
  // manually here (see https://github.com/ant-design/ant-design/issues/24022).
  const filters = useTablesStore(state => state.tableStates[id]?.filters)

  const filteredItems = useMemo(() => {
    if (!filters) {
      return items
    }
    return items
      .filter(i => filters.status === null || filters.status.includes(i.status))
      .filter(
        i =>
          filters.tags === null ||
          filters.tags.some(t => i.tags.includes(t as string))
      )
  }, [items, filters])

  return (
    <Row gutter={16}>
      <Col span={18}>
        <ItemsTable
          id={id}
          items={filteredItems}
          possibleStatuses={possibleStatuses}
          defaultVisibleStatuses={defaultVisibleStatuses}
        />
      </Col>
      <Col span={6}>
        <GraphCard items={filteredItems} />
      </Col>
    </Row>
  )
}

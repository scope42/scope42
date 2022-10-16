import Table, { ColumnsType } from 'antd/lib/table'
import { getIncomingRelations, getOutgoingRelations, Relation } from '..'
import { ItemLink } from '../../../components/ItemLink'
import { useStore } from '../../../data/store'
import { Item } from '../../../data/types'

const columns: ColumnsType<Relation> = [
  {
    dataIndex: 'label',
    key: 'label'
  },
  {
    dataIndex: 'item',
    key: 'item',
    render: (item: Item) => <ItemLink id={item.id} />
  }
]

export const Relations: React.FC<{ item: Item }> = ({ item }) => {
  const allItems = useStore(state => state.items)
  const relations = [
    ...getOutgoingRelations(item, allItems),
    ...getIncomingRelations(item, allItems)
  ]
  return (
    <Table
      dataSource={relations}
      columns={columns}
      rowKey={r => r.label + r.item.id}
      showHeader={false}
      pagination={false}
    />
  )
}

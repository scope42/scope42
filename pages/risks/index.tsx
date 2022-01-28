/* eslint-disable react/display-name */
import { Risk, RiskId, RiskStatus } from '../../data/types'
import { Table, Tag } from 'antd'
import { useStore } from '../../data/store'
import { RiskLink } from '../../components/ItemLink'
import { RISK_STATUS_UI } from '../../components/Status'
import { renderDate } from '../../data/util'
import { PageHeader } from '../../components/PageHeader'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, risk: Risk & {id: RiskId}) => <RiskLink id={risk.id} />,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: RiskStatus) => RISK_STATUS_UI[status].component
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>)
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    render: renderDate
  },
  {
    title: 'Modified',
    dataIndex: 'modified',
    key: 'modified',
    render: renderDate
  },
]

export default function RisksPage() {
  const risks = useStore(state => state.risks)
  const dataSource = Object.keys(risks).map(id => ({ ...risks[id], id }))
  return (
    <div>
      <PageHeader title='Issues' />
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

/* eslint-disable react/display-name */
import { Improvement, ImprovementId, ImprovementStatus } from '../data/types'
import { Table, Tag } from 'antd'
import { useStore } from '../data/store'
import { ImprovementLink } from '../components/ItemLink'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { PageHeader } from '../components/PageHeader'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (
      title: string,
      improvement: Improvement & { id: ImprovementId }
    ) => <ImprovementLink id={improvement.id} />
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: ImprovementStatus) =>
      IMPROVEMENT_STATUS_UI[status].component
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
  }
]

export default function ImprovementsPage() {
  const improvements = useStore(state => state.improvements)
  const dataSource = Object.keys(improvements).map(id => ({
    ...improvements[id],
    id
  }))
  return (
    <div>
      <PageHeader title="Issues" />
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

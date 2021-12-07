/* eslint-disable react/display-name */
import { EntityId, Issue } from '../../data'
import { Table } from 'antd'
import  Link  from 'next/link'
import { useStore } from '../../data/store'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, issue: Issue & {id: EntityId}) => <Link href={`/issues/${issue.id}`}>{title}</Link>,
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
]

export default function IssuesPage() {
  const issues = useStore(state => state.issues)
  const dataSource = Object.keys(issues).map(id => ({ ...issues[id], id }))
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}

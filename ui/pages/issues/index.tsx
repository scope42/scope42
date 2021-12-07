/* eslint-disable react/display-name */
import { Issue } from '../../data'
import { Table } from 'antd'
import  Link  from 'next/link'
import { useStore } from '../../data/store'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, issue: Issue) => <Link href={`/issues/${issue.id}`}>{title}</Link>,
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'age',
  },
]

export default function IssuesPage() {
  const issues = useStore(state => state.issues)
  return (
    <div>
      <Table dataSource={issues} columns={columns} />
    </div>
  )
}

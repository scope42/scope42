/* eslint-disable react/display-name */
import { Issue, loadIssues } from '../../data'
import { Table } from 'antd'
import  Link  from 'next/link'

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

export default function Issues({ issues }: {issues: Issue[]}) {
  return (
    <div>
      <Table dataSource={issues} columns={columns} />
    </div>
  )
}

export function getStaticProps() {
  return { props: { issues: loadIssues() } }
}

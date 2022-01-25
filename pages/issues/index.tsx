/* eslint-disable react/display-name */
import { Issue, IssueId } from '../../data/types'
import { Table } from 'antd'
import  Link  from 'next/link'
import { useStore } from '../../data/store'
import { IssueLink } from '../../components/EntityLink'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, issue: Issue & {id: IssueId}) => <IssueLink id={issue.id} />,
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
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

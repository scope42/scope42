/* eslint-disable react/display-name */
import { Issue, IssueId, IssueStatus } from '../../data/types'
import { Table, Tag } from 'antd'
import { useStore } from '../../data/store'
import { IssueLink } from '../../components/EntityLink'
import { ISSUE_STATUS_UI } from '../../components/Status'
import { renderDate } from '../../data/util'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, issue: Issue & {id: IssueId}) => <IssueLink id={issue.id} />,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: IssueStatus) => ISSUE_STATUS_UI[status].component
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

export default function IssuesPage() {
  const issues = useStore(state => state.issues)
  const dataSource = Object.keys(issues).map(id => ({ ...issues[id], id }))
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

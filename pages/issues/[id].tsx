import ReactMarkdown from 'react-markdown/react-markdown.min'
import { Tag, Row, Descriptions, Badge, Button } from 'antd'
import { useRouter } from 'next/router'
import { useStore } from '../../data/store'
import { EditOutlined, StopOutlined } from '@ant-design/icons'
import { IssueLink } from '../../components/ItemLink'
import { IssueGraph } from '../../components/Graph'
import { ISSUE_STATUS_UI } from '../../components/Status'
import { useState } from 'react'
import { EditIssue } from '../../components/EditIssue'
import { renderDate } from '../../data/util'
import { IssueIcon } from '../../components/ItemIcon'
import { PageHeader } from '../../components/PageHeader'
import Error404 from '../404'

const IssuePage = () => {
  const [editing, setEditing] = useState(false)
  const router = useRouter()
  const id = String(router.query.id)
  const issue = useStore(state => state.issues[id])
  
  if (!issue) {
    return <Error404 />
  }

  return <>
    <PageHeader
      title={issue.title}
      icon={<IssueIcon size={24} />}
      backButton
      extra={<Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>Edit</Button>}
    >
      <Row>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Status">
            {ISSUE_STATUS_UI[issue.status].component}
          </Descriptions.Item>
          <Descriptions.Item label="Created">{renderDate(issue.created)}</Descriptions.Item>
          <Descriptions.Item label="Modified">{renderDate(issue.modified)}</Descriptions.Item>
          <Descriptions.Item label="Cause">
            {issue.cause ? <IssueLink id={issue.cause} /> : <Tag color="red"><StopOutlined /> Root Cause</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {issue.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </Descriptions.Item>
        </Descriptions>
      </Row>
    </PageHeader>
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1 }}>
        <ReactMarkdown>{issue.body || ''}</ReactMarkdown>
      </div>
      <IssueGraph id={id} />
    </div>
    {editing ? <EditIssue hide={() => setEditing(false)} issueId={id} /> : null}
  </>
}

export default IssuePage

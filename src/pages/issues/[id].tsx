import ReactMarkdown from 'react-markdown'
import { Tag, Row, Descriptions, Button } from 'antd'
import { useStore } from '../../data/store'
import { EditOutlined, StopOutlined } from '@ant-design/icons'
import { IssueLink } from '../../components/ItemLink'
import { IssueGraph } from '../../components/Graph'
import { ISSUE_STATUS_UI } from '../../components/Status'
import { renderDate } from '../../data/util'
import { IssueIcon } from '../../components/ItemIcon'
import { PageHeader } from '../../components/PageHeader'
import Error404 from '../404'
import { useEditorStore } from '../../components/ItemEditor/ItemEditor'
import { useParams } from 'react-router-dom'

const IssuePage = () => {
  const id = String(useParams().id)
  const issue = useStore(state => state.issues[id])
  const edit = useEditorStore(state => state.editIssue)

  if (!issue) {
    return <Error404 />
  }

  return <>
    <PageHeader
      title={issue.title}
      icon={<IssueIcon size={24} />}
      backButton
      extra={<Button type="primary" icon={<EditOutlined />} onClick={() => edit(id)}>Edit</Button>}
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
  </>
}

export default IssuePage

import ReactMarkdown from 'react-markdown/react-markdown.min'
import { PageHeader, Tag, Row, Descriptions, Badge } from 'antd'
import { useRouter } from 'next/router'
import { useStore } from '../../data/store'
import { StopOutlined } from '@ant-design/icons'
import { IssueLink } from '../../components/EntityLink'
import { IssueGraph } from '../../components/Graph'
import { ISSUE_STATUS_UI } from '../../components/Status'

const IssuePage = () => {
  const router = useRouter()
  const id = String(router.query.id)
  const issue = useStore(state => state.issues[id])
  if (!issue) {
    return <>404</>
  }

  return <>
    <PageHeader
      onBack={() => window.history.back()}
      title={<><Badge color={'cyan'} />{issue.title}</>}
      subTitle="This is a subtitle"
    >
      <Row>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Status">
            {ISSUE_STATUS_UI[issue.status].component}
          </Descriptions.Item>
          <Descriptions.Item label="Created">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="Tags">
            {issue.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </Descriptions.Item>
          <Descriptions.Item label="Cause">
            {issue.cause ? <IssueLink id={issue.cause} /> : <Tag color="red"><StopOutlined /> Root Cause</Tag>}
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

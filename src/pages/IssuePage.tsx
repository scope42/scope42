import { Tag, Row, Descriptions, Button } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined, StopOutlined } from '@ant-design/icons'
import { ISSUE_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { IssueIcon } from '../components/ItemIcon'
import { PageHeader } from '../components/PageHeader'
import Error404 from '../components/Error404'
import { useEditorStore } from '../components/ItemEditor/ItemEditor'
import { useParams } from 'react-router-dom'
import { TicketLink } from '../components/TicketLink'
import { IssueId } from '../data/types'
import { ItemDetailsPage } from '../features/items'

const IssuePage = () => {
  const id = String(useParams().id) as IssueId
  const issue = useStore(state => state.items[id])
  const edit = useEditorStore(state => state.editIssue)

  if (!issue || issue.type !== 'issue') {
    return <Error404 />
  }

  return (
    <>
      <PageHeader
        title={issue.title}
        icon={<IssueIcon size={24} />}
        backButton
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => edit(id)}
          >
            Edit
          </Button>
        }
        tags={
          issue.causedBy.length === 0 ? (
            <Tag color="red">
              <StopOutlined /> Root Cause
            </Tag>
          ) : (
            []
          )
        }
      >
        <Row>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Status">
              {ISSUE_STATUS_UI[issue.status].component}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(issue.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(issue.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {issue.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            {issue.ticket ? (
              <Descriptions.Item label="Ticket">
                <TicketLink url={issue.ticket} />
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </Row>
      </PageHeader>
      <ItemDetailsPage item={issue} />
    </>
  )
}

export default IssuePage

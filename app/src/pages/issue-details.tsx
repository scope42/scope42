import { Tag, Row, Descriptions, Button, Typography } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined, StopOutlined } from '@ant-design/icons'
import { ItemStatus } from '../features/items'
import { renderDate } from '../data/util'
import { IssueIcon } from '../features/items'
import { PageHeader } from '../features/layout'
import { Error404, TicketLink } from '../features/ui'
import { useParams } from 'react-router-dom'
import { IssueId } from '@scope42/data'
import { ItemDetailsPage, useEditorStore } from '../features/items'
import { Markdown } from '../features/markdown'

const IssueDetailsPage = () => {
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
          <>
            <Tag>{issue.id}</Tag>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => edit(id)}
            >
              Edit
            </Button>
          </>
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
              <ItemStatus item={issue} />
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
      <ItemDetailsPage item={issue}>
        {issue.description && (
          <>
            <Typography.Title level={2}>Description</Typography.Title>
            <Markdown>{issue.description}</Markdown>
          </>
        )}
      </ItemDetailsPage>
    </>
  )
}

export default IssueDetailsPage

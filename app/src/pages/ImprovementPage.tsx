import { Tag, Row, Descriptions, Button, Typography } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { ImprovementIcon } from '../components/ItemIcon'
import { PageHeader } from '../components/PageHeader'
import { Error404 } from '../features/ui'
import { useParams } from 'react-router-dom'
import { TicketLink } from '../components/TicketLink'
import { ImprovementId } from '../data/types'
import { ItemDetailsPage, useEditorStore } from '../features/items'
import { Markdown } from '../features/markdown'

const ImprovementPage = () => {
  const id = String(useParams().id) as ImprovementId
  const improvement = useStore(state => state.items[id])
  const edit = useEditorStore(state => state.editImprovement)

  if (!improvement || improvement.type !== 'improvement') {
    return <Error404 />
  }

  return (
    <>
      <PageHeader
        title={improvement.title}
        icon={<ImprovementIcon size={24} />}
        backButton
        extra={
          <>
            <Tag>{improvement.id}</Tag>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => edit(id)}
            >
              Edit
            </Button>
          </>
        }
      >
        <Row>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Status">
              {IMPROVEMENT_STATUS_UI[improvement.status].component}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(improvement.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(improvement.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {improvement.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            {improvement.ticket ? (
              <Descriptions.Item label="Ticket">
                <TicketLink url={improvement.ticket} />
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </Row>
      </PageHeader>
      <ItemDetailsPage item={improvement}>
        {improvement.description && (
          <>
            <Typography.Title level={2}>Description</Typography.Title>
            <Markdown>{improvement.description}</Markdown>
          </>
        )}
      </ItemDetailsPage>
    </>
  )
}

export default ImprovementPage

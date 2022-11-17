import { Tag, Row, Descriptions, Button, Typography } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { renderDate } from '../data/util'
import { ItemStatus, RiskIcon } from '../features/items'
import { PageHeader } from '../features/layout'
import { Error404, TicketLink } from '../features/ui'
import { useParams } from 'react-router-dom'
import { RiskId } from '@scope42/data'
import { ItemDetailsPage, useEditorStore } from '../features/items'
import { Markdown } from '../features/markdown'

const RiskDetailsPage = () => {
  const id = String(useParams().id) as RiskId
  const risk = useStore(state => state.items[id])
  const edit = useEditorStore(state => state.editRisk)

  if (!risk || risk.type !== 'risk') {
    return <Error404 />
  }

  return (
    <>
      <PageHeader
        title={risk.title}
        icon={<RiskIcon size={24} />}
        backButton
        extra={
          <>
            <Tag>{risk.id}</Tag>
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
              <ItemStatus item={risk} />
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(risk.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(risk.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {risk.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            {risk.ticket ? (
              <Descriptions.Item label="Ticket">
                <TicketLink url={risk.ticket} />
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </Row>
      </PageHeader>
      <ItemDetailsPage item={risk}>
        {risk.description && (
          <>
            <Typography.Title level={2}>Description</Typography.Title>
            <Markdown>{risk.description}</Markdown>
          </>
        )}
      </ItemDetailsPage>
    </>
  )
}

export default RiskDetailsPage

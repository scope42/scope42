import { Tag, Row, Descriptions, Button, Typography, Space } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { DECISION_STATUS_UI } from '../features/items'
import { renderDate } from '../data/util'
import { DecisionIcon } from '../features/items'
import { PageHeader } from '../features/layout'
import { Error404, TicketLink } from '../features/ui'
import { useParams } from 'react-router-dom'
import { DecisionId } from '@scope42/data'
import { ItemDetailsPage, useEditorStore } from '../features/items'
import { Markdown } from '../features/markdown'
import { Person } from '../features/people'
import { DecisionOptions, DecisionOutcome } from '../features/decisions'

const DecisionDetailsPage = () => {
  const id = String(useParams().id) as DecisionId
  const decision = useStore(state => state.items[id])
  const edit = useEditorStore(state => state.editDecision)

  if (!decision || decision.type !== 'decision') {
    return <Error404 />
  }

  return (
    <>
      <PageHeader
        title={decision.title}
        icon={<DecisionIcon size={24} />}
        backButton
        extra={
          <>
            <Tag>{decision.id}</Tag>
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
              {DECISION_STATUS_UI[decision.status].component}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(decision.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(decision.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {decision.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Descriptions.Item>
            {decision.ticket ? (
              <Descriptions.Item label="Ticket">
                <TicketLink url={decision.ticket} />
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Deciders">
              <Space size="middle">
                {decision.deciders.map(decider => (
                  <Person key={decider} name={decider} />
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Decided">
              {decision.decided && renderDate(decision.decided)}
            </Descriptions.Item>
          </Descriptions>
        </Row>
      </PageHeader>
      <ItemDetailsPage item={decision}>
        <Typography.Title level={2}>Context</Typography.Title>
        <Markdown>{decision.context}</Markdown>
        {decision.drivers && (
          <>
            <Typography.Title level={2}>Decision Drivers</Typography.Title>
            <Markdown>{decision.drivers}</Markdown>
          </>
        )}
        <Typography.Title level={2}>Considered Options</Typography.Title>
        <DecisionOptions decision={decision} />
        <Typography.Title level={2}>Outcome</Typography.Title>
        <DecisionOutcome decision={decision} />
      </ItemDetailsPage>
    </>
  )
}

export default DecisionDetailsPage

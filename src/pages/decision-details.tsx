import { Tag, Row, Descriptions, Button } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { DECISION_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { DecisionIcon } from '../components/ItemIcon'
import { PageHeader } from '../components/PageHeader'
import Error404 from '../components/Error404'
import { useEditorStore } from '../components/ItemEditor/ItemEditor'
import { useParams } from 'react-router-dom'
import { TicketLink } from '../components/TicketLink'
import { DecisionId } from '../data/types'
import { ItemDetailsPage } from '../features/items'

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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => edit(id)}
          >
            Edit
          </Button>
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
          </Descriptions>
        </Row>
      </PageHeader>
      <ItemDetailsPage item={decision} />
    </>
  )
}

export default DecisionDetailsPage

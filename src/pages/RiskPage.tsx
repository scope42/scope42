import ReactMarkdown from 'react-markdown'
import { Tag, Row, Descriptions, Button } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { RiskGraph } from '../components/Graph'
import { RISK_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { RiskIcon } from '../components/ItemIcon'
import { PageHeader } from '../components/PageHeader'
import Error404 from '../components/Error404'
import { useEditorStore } from '../components/ItemEditor/ItemEditor'
import { useParams } from 'react-router-dom'
import { ItemLinkList } from '../components/ItemLink'
import { TicketLink } from '../components/TicketLink'
import { RiskId } from '../data/types'

const RiskPage = () => {
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
              {RISK_STATUS_UI[risk.status].component}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(risk.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(risk.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Cause">
              <ItemLinkList ids={risk.causedBy} />
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
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          <ReactMarkdown>{risk.description || ''}</ReactMarkdown>
        </div>
        <RiskGraph id={id} />
      </div>
    </>
  )
}

export default RiskPage

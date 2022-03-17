import ReactMarkdown from 'react-markdown'
import { Tag, Row, Descriptions, Button } from 'antd'
import { useStore } from '../data/store'
import { EditOutlined } from '@ant-design/icons'
import { ItemLinkList } from '../components/ItemLink'
import { ImprovementGraph } from '../components/Graph'
import { IMPROVEMENT_STATUS_UI } from '../components/Status'
import { renderDate } from '../data/util'
import { ImprovementIcon } from '../components/ItemIcon'
import { PageHeader } from '../components/PageHeader'
import Error404 from '../components/Error404'
import { useEditorStore } from '../components/ItemEditor/ItemEditor'
import { useParams } from 'react-router-dom'
import { TicketLink } from '../components/TicketLink'

const ImprovementPage = () => {
  const id = String(useParams().id)
  const improvement = useStore(state => state.improvements[id])
  const edit = useEditorStore(state => state.editImprovement)

  if (!improvement) {
    return <Error404 />
  }

  return (
    <>
      <PageHeader
        title={improvement.title}
        icon={<ImprovementIcon size={24} />}
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
              {IMPROVEMENT_STATUS_UI[improvement.status].component}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {renderDate(improvement.created)}
            </Descriptions.Item>
            <Descriptions.Item label="Modified">
              {renderDate(improvement.modified)}
            </Descriptions.Item>
            <Descriptions.Item label="Resolves">
              <ItemLinkList ids={improvement.resolves} />
            </Descriptions.Item>
            <Descriptions.Item label="Modifies">
              <ItemLinkList ids={improvement.modifies} />
            </Descriptions.Item>
            <Descriptions.Item label="Creates">
              <ItemLinkList ids={improvement.creates} />
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
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          <ReactMarkdown>{improvement.description || ''}</ReactMarkdown>
        </div>
        <ImprovementGraph id={id} />
      </div>
    </>
  )
}

export default ImprovementPage

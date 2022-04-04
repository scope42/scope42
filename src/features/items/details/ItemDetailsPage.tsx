import { Col, Row, Typography } from 'antd'
import ReactMarkdown from 'react-markdown'
import { Item } from '../../../data/types'
import { GraphCard } from '../../graphs'
import { Comments } from './Comments'
import { Relations } from './relations.conponent'

const { Title } = Typography

export interface ItemDetailsPageProps {
  item: Item
}

export const ItemDetailsPage: React.VFC<ItemDetailsPageProps> = props => {
  const { item } = props
  return (
    <Row gutter={16}>
      <Col span={14}>
        <Title level={2}>Description</Title>
        <ReactMarkdown>{item.description || ''}</ReactMarkdown>
        <Title level={2}>Comments</Title>
        <Comments item={item} />
      </Col>
      <Col span={10}>
        <Title level={2}>Relations</Title>
        <GraphCard items={[item]} alwaysShowRelatedItems />
        <Relations item={item} />
      </Col>
    </Row>
  )
}

import { Col, Row, Typography } from 'antd'
import { Item } from '../../../data/types'
import { GraphCard } from '../../graphs'
import { Comments } from './Comments'
import { Relations } from './relations.conponent'

const { Title } = Typography

export interface ItemDetailsPageProps {
  children: React.ReactNode
  item: Item
}

export const ItemDetailsPage: React.FC<ItemDetailsPageProps> = props => {
  const { item, children } = props
  return (
    <Row gutter={16}>
      <Col span={14}>
        {children}
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

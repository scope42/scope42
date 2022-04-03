import { Col, Row } from 'antd'
import ReactMarkdown from 'react-markdown'
import { Item } from '../../../data/types'
import { GraphCard } from '../../graphs'
import { Relations } from './relations.conponent'

export interface ItemDetailsPageProps {
  item: Item
}

export const ItemDetailsPage: React.VFC<ItemDetailsPageProps> = props => {
  const { item } = props
  return (
    <Row>
      <Col span={14}>
        <h2>Description</h2>
        <ReactMarkdown>{item.description || ''}</ReactMarkdown>
      </Col>
      <Col span={10}>
        <h2>Relations</h2>
        <GraphCard items={[item]} alwaysShowRelatedItems />
        <Relations item={item} />
      </Col>
    </Row>
  )
}

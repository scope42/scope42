import { Col, Row } from 'antd'
import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { Item } from '../../../data/types'
import { Relations } from './relations.conponent'

export interface ItemDetailsPageProps {
  item: Item
  graph: ReactNode
}

export const ItemDetailsPage: React.VFC<ItemDetailsPageProps> = props => {
  const { item, graph } = props
  return (
    <Row>
      <Col span={14}>
        <h2>Description</h2>
        <ReactMarkdown>{item.description || ''}</ReactMarkdown>
      </Col>
      <Col span={10}>
        <h2>Relations</h2>
        {graph}
        <Relations item={item} />
      </Col>
    </Row>
  )
}

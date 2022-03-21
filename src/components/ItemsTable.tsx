import { Table, Tag } from 'antd'
import React from 'react'
import { ItemWithId } from '../data/types'
import { renderDate } from '../data/util'
import { ItemLink } from './ItemLink'
import { ItemStatus } from './Status'

const columns = [
  {
    title: 'Title',
    dataIndex: ['data', 'title'],
    key: 'title',
    render: (_: string, item: ItemWithId) => <ItemLink id={item.id} />
  },
  {
    title: 'Status',
    dataIndex: ['data', 'status'],
    key: 'status',
    render: (_: any, item: ItemWithId) => <ItemStatus item={item} />
  },
  {
    title: 'Tags',
    dataIndex: ['data', 'tags'],
    key: 'tags',
    render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>)
  },
  {
    title: 'Created',
    dataIndex: ['data', 'created'],
    key: 'created',
    render: renderDate
  },
  {
    title: 'Modified',
    dataIndex: ['data', 'modified'],
    key: 'modified',
    render: renderDate
  }
]

export interface ItemsTableProps {
  items: ItemWithId[]
}

export const ItemsTable: React.VFC<ItemsTableProps> = props => {
  return <Table dataSource={props.items} columns={columns} rowKey="id" />
}

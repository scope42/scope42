import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import React from 'react'
import { ItemWithId } from '../data/types'
import { renderDate } from '../data/util'
import { ItemLink } from './ItemLink'
import { ItemStatus } from './Status'

const alphabeticSorter =
  (extractProperty: (item: ItemWithId) => string | null | undefined) =>
  (a: ItemWithId, b: ItemWithId) => {
    const valA = extractProperty(a) || ''
    const valB = extractProperty(b) || ''
    return valA.localeCompare(valB)
  }

const dateSorter =
  (extractProperty: (item: ItemWithId) => Date | null | undefined) =>
  (a: ItemWithId, b: ItemWithId) => {
    return dayjs(extractProperty(a)).diff(extractProperty(b))
  }

const columns: ColumnsType<ItemWithId> = [
  {
    title: 'Title',
    dataIndex: ['data', 'title'],
    key: 'title',
    render: (_: string, item: ItemWithId) => <ItemLink id={item.id} />,
    sorter: alphabeticSorter(item => item.data.title)
  },
  {
    title: 'Status',
    dataIndex: ['data', 'status'],
    key: 'status',
    render: (_: any, item: ItemWithId) => <ItemStatus item={item} />,
    sorter: alphabeticSorter(item => item.data.status)
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
    render: renderDate,
    sorter: dateSorter(item => item.data.created)
  },
  {
    title: 'Modified',
    dataIndex: ['data', 'modified'],
    key: 'modified',
    render: renderDate,
    sorter: dateSorter(item => item.data.modified),
    defaultSortOrder: 'descend'
  }
]

export interface ItemsTableProps {
  items: ItemWithId[]
}

export const ItemsTable: React.VFC<ItemsTableProps> = props => {
  return <Table dataSource={props.items} columns={columns} rowKey="id" />
}

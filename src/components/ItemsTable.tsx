import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import React from 'react'
import { selectAllTags, useStore } from '../data/store'
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

export interface ItemsTableProps {
  items: ItemWithId[]
  possibleStatuses: { text: string; value: string }[]
  defaultVisibleStatuses: string[]
}

export const ItemsTable: React.VFC<ItemsTableProps> = props => {
  const allTags = useStore(selectAllTags)

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
      sorter: alphabeticSorter(item => item.data.status),
      filters: props.possibleStatuses,
      onFilter: (value, item) => item.data.status === value,
      defaultFilteredValue: props.defaultVisibleStatuses
    },
    {
      title: 'Tags',
      dataIndex: ['data', 'tags'],
      key: 'tags',
      render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>),
      filters: allTags.map(tag => ({ text: tag, value: tag })),
      onFilter: (value, item) => item.data.tags.includes(value as string)
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

  return <Table dataSource={props.items} columns={columns} rowKey="id" />
}

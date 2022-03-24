import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import React from 'react'
import { selectAllTags, useStore } from '../data/store'
import { Item } from '../data/types'
import { renderDate } from '../data/util'
import { ItemLink } from './ItemLink'
import { ItemStatus } from './Status'

const alphabeticSorter =
  (extractProperty: (item: Item) => string | null | undefined) =>
  (a: Item, b: Item) => {
    const valA = extractProperty(a) || ''
    const valB = extractProperty(b) || ''
    return valA.localeCompare(valB)
  }

const dateSorter =
  (extractProperty: (item: Item) => Date | null | undefined) =>
  (a: Item, b: Item) => {
    return dayjs(extractProperty(a)).diff(extractProperty(b))
  }

export interface ItemsTableProps {
  items: Item[]
  possibleStatuses: { text: string; value: string }[]
  defaultVisibleStatuses: string[]
}

export const ItemsTable: React.VFC<ItemsTableProps> = props => {
  const allTags = useStore(selectAllTags)

  const columns: ColumnsType<Item> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: string, item: Item) => <ItemLink id={item.id} />,
      sorter: alphabeticSorter(item => item.title)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, item: Item) => <ItemStatus item={item} />,
      sorter: alphabeticSorter(item => item.status),
      filters: props.possibleStatuses,
      onFilter: (value, item) => item.status === value,
      defaultFilteredValue: props.defaultVisibleStatuses
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>),
      filters: allTags.map(tag => ({ text: tag, value: tag })),
      onFilter: (value, item) => item.tags.includes(value as string)
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: renderDate,
      sorter: dateSorter(item => item.created)
    },
    {
      title: 'Modified',
      dataIndex: 'modified',
      key: 'modified',
      render: renderDate,
      sorter: dateSorter(item => item.modified),
      defaultSortOrder: 'descend'
    }
  ]

  return <Table dataSource={props.items} columns={columns} rowKey="id" />
}

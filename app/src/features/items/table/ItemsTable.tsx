import { Table, Tag } from 'antd'
import { ColumnsType, TableProps } from 'antd/lib/table'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { selectAllTags, useStore } from '../../../data/store'
import { Item } from '../../../data/types'
import { renderDate } from '../../../data/util'
import { ItemLink } from '../../../components/ItemLink'
import { ItemStatus } from '../../../components/Status'
import { TableState, useTablesStore } from './store'
import { SorterResult } from 'antd/lib/table/interface'

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
  id: string
  items: Item[]
  possibleStatuses: { text: string; value: string }[]
  defaultVisibleStatuses: string[] | null
}

export const ItemsTable: React.VFC<ItemsTableProps> = props => {
  const { id, items, defaultVisibleStatuses, possibleStatuses } = props
  const allTags = useStore(selectAllTags)
  const tableState: TableState = useTablesStore(
    state => state.tableStates[props.id]
  )
  const setTableState = useTablesStore(state => state.setTableState)

  useEffect(() => {
    if (tableState === undefined) {
      setTableState(id, {
        pagination: { current: 1, pageSize: 10 },
        filters: { tags: null, status: defaultVisibleStatuses },
        sorter: { columnKey: 'modified', order: 'descend' }
      })
    }
  }, [id, defaultVisibleStatuses, tableState, setTableState])

  const handleChange: TableProps<Item>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableState(id, { pagination, filters, sorter })
  }

  const getSortOrder = (columnKey: string) => {
    const sorter = tableState?.sorter as SorterResult<Item> | undefined // as long as we only allow sorting by one column
    return sorter?.columnKey === columnKey ? sorter.order : null
  }

  // We expect filtered items as input, hence no `onFilter`
  const columns: ColumnsType<Item> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: string, item: Item) => <ItemLink id={item.id} noPopover />,
      sorter: alphabeticSorter(item => item.title),
      sortOrder: getSortOrder('title')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, item: Item) => <ItemStatus item={item} />,
      sorter: alphabeticSorter(item => item.status),
      filters: possibleStatuses,
      filteredValue: tableState?.filters.status ?? null,
      sortOrder: getSortOrder('status')
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => tags.map(tag => <Tag key={tag}>{tag}</Tag>),
      filters: allTags.map(tag => ({ text: tag, value: tag })),
      filteredValue: tableState?.filters.tags ?? null
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: renderDate,
      sorter: dateSorter(item => item.created),
      sortOrder: getSortOrder('created')
    },
    {
      title: 'Modified',
      dataIndex: 'modified',
      key: 'modified',
      render: renderDate,
      sorter: dateSorter(item => item.modified),
      defaultSortOrder: 'descend',
      sortOrder: getSortOrder('modified')
    }
  ]

  return (
    <Table
      dataSource={items}
      columns={columns}
      rowKey="id"
      onChange={handleChange}
    />
  )
}

import {
  FilterValue,
  SorterResult,
  TablePaginationConfig
} from 'antd/lib/table/interface'
import produce from 'immer'
import create from 'zustand'
import { Item } from '@scope42/data'

export interface TableState {
  pagination: TablePaginationConfig
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<Item> | SorterResult<Item>[]
}

interface TablesState {
  tableStates: Record<string, TableState>
  setTableState: (id: string, tableState: TableState) => void
}

/**
 * This store is dedicated to storing the state (filter, sorting, pagination) of tables.
 */
export const useTablesStore = create<TablesState>(set => ({
  tableStates: {},
  setTableState: (id, tableState) =>
    set(
      produce(state => {
        state.tableStates[id] = tableState
      })
    )
}))

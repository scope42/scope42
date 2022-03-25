import {
  FilterValue,
  SorterResult,
  TablePaginationConfig
} from 'antd/lib/table/interface'
import produce from 'immer'
import create from 'zustand'

export interface TableState<RecordType> {
  pagination: TablePaginationConfig
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[]
}

interface TablesState {
  tableStates: Record<string, TableState<any>>
  setTableState: (id: string, tableState: TableState<any>) => void
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

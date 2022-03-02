import { ItemId, ItemType } from './types'
import dayjs from 'dayjs'

export function getNumericId(id: ItemId): number {
  return parseInt(id.split('-')[1])
}

export function getTypeFromId(id: ItemId): ItemType {
  return ItemType.parse(id.split('-')[0])
}

export function renderDate(date: Date) {
  return dayjs(date).format('YYYY-MM-DD')
}

import { ItemId } from "./types"
import dayjs from 'dayjs'

export function getNumericId(id: ItemId): number {
  return parseInt(id.split("-")[1])
}

export function renderDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD")
}
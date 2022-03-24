import { ItemId, ItemType } from './types'
import dayjs from 'dayjs'
import { z } from 'zod'

export function getSerialFromId(id: ItemId): number {
  return parseInt(id.split('-')[1])
}

export function getIdFromSerial(serial: number, type: ItemType): ItemId {
  switch (type) {
    case 'issue':
      return `issue-${serial}`
    case 'improvement':
      return `improvement-${serial}`
    case 'risk':
      return `risk-${serial}`
  }
}

export function getTypeFromId(id: ItemId): ItemType {
  return ItemType.parse(id.split('-')[0])
}

export function renderDate(date: Date) {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * There is no simple way to get the default values of an item schema because
 * parsing fails if required properties are undefined. This function extracts
 * default values from the first level. These are needed for creating new items.
 */
export function getDefaults<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): Partial<z.infer<z.ZodObject<T>>> {
  return Object.entries(schema.shape).reduce((curr, [key, value]) => {
    const defaultValue = value.safeParse(undefined)
    return {
      ...curr,
      [key]: defaultValue.success ? defaultValue.data : undefined
    }
  }, {})
}

export function exists<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

import { ItemId, ItemType } from './model'

export function getSerialFromItemId(id: ItemId): number {
  return parseInt(id.split('-')[1])
}

export function getItemIdFromSerial(serial: number, type: ItemType): ItemId {
  switch (type) {
    case 'issue':
      return `issue-${serial}`
    case 'improvement':
      return `improvement-${serial}`
    case 'risk':
      return `risk-${serial}`
    case 'decision':
      return `decision-${serial}`
  }
}

export function getItemTypeFromId(id: ItemId): ItemType {
  return ItemType.parse(id.split('-')[0])
}

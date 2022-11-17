import { Item, ItemId, ItemType } from './model'

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

export function statusLabel(itemOrStatus: Item | Item['status']) {
  const status =
    typeof itemOrStatus === 'string' ? itemOrStatus : itemOrStatus.status
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function statusActive(itemOrStatus: Item | Item['status']): boolean {
  const status =
    typeof itemOrStatus === 'string' ? itemOrStatus : itemOrStatus.status
  switch (status) {
    case 'proposed':
    case 'potential':
    case 'current':
    case 'accepted':
      return true
    case 'resolved':
    case 'discarded':
    case 'mitigated':
    case 'implemented':
    case 'deprecated':
    case 'superseded':
      return false
  }
  // no default - when a status is added, we'll get a type error
}

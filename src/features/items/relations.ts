import {
  AppState,
  Items,
  selectAllDecisions,
  selectAllImprovements,
  selectAllIssues,
  selectAllRisks
} from '../../data/store'
import { Item, ItemId } from '../../data/types'
import { exists } from '../../data/util'

export interface Relation {
  item: Item
  label: string
}

export function getOutgoingRelations(item: Item, pool: Items): Relation[] {
  const resolve = (ids: Array<ItemId | undefined>, label: string): Relation[] =>
    ids
      .filter(exists)
      .map(id => pool[id])
      .filter(exists)
      .map(i => ({ item: i, label }))

  switch (item.type) {
    case 'issue':
      return resolve(item.causedBy, 'caused by')
    case 'improvement':
      return [
        ...resolve(item.resolves, 'resolves'),
        ...resolve(item.creates, 'creates'),
        ...resolve(item.modifies, 'modifies')
      ]
    case 'risk':
      return [...resolve(item.causedBy, 'caused by')]
    case 'decision':
      return [...resolve([item.supersededBy], 'superseded by')]
  }
}

export function getIncomingRelations(item: Item, pool: Items): Relation[] {
  function resolve<T extends Item>(
    selector: (items: Pick<AppState, 'items'>) => T[],
    getProperty: (item: T) => ItemId[],
    label: string
  ): Relation[] {
    return selector({ items: pool })
      .filter(i => getProperty(i).includes(item.id))
      .map(i => ({ item: i, label }))
  }

  switch (item.type) {
    case 'issue':
      return [
        ...resolve(selectAllImprovements, i => i.resolves, 'resolved by'),
        ...resolve(selectAllIssues, i => i.causedBy, 'causes'),
        ...resolve(selectAllRisks, i => i.causedBy, 'causes')
      ]
    case 'improvement':
      return []
    case 'risk':
      return [
        ...resolve(selectAllImprovements, i => i.resolves, 'resolved by'),
        ...resolve(selectAllImprovements, i => i.creates, 'created by'),
        ...resolve(selectAllImprovements, i => i.modifies, 'modified by')
      ]
    case 'decision':
      return [
        ...resolve(
          selectAllDecisions,
          i => (i.supersededBy ? [i.supersededBy] : []),
          'supersedes'
        )
      ]
  }
}

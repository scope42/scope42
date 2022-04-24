import { Index } from 'flexsearch'
import { Item, ItemId, ItemType } from '../../data/types'
import { getIdFromSerial, getSerialFromId } from '../../data/util'

/**
 * flexsearch strongly recommends using numeric IDs. To achieve this, we
 * multiply each item ID with 10 and add a type-specific units digit.
 */
const ID_SUFFIX: Record<ItemType, number> = {
  issue: 0,
  improvement: 1,
  risk: 2,
  decision: 3
}

const index = new Index({ tokenize: 'forward' })

function getIndexId(item: Item): number {
  return getSerialFromId(item.id) * 10 + ID_SUFFIX[item.type]
}

function getItemId(indexId: number) {
  const suffix = indexId % 10
  const serial = Math.floor(indexId / 10)
  const type = Object.keys(ID_SUFFIX).find(
    key => ID_SUFFIX[key as ItemType] === suffix
  ) as ItemType
  return getIdFromSerial(serial, type)
}

export async function addToSearchIndex(item: Item) {
  return index.addAsync(getIndexId(item), item.title)
}

export async function search(query: string): Promise<ItemId[]> {
  const result = await index.searchAsync(query, { suggest: true })
  return result.map(indexId => getItemId(indexId as number))
}

export async function suggest(query: string): Promise<ItemId[]> {
  const result = await index.searchAsync(query, { suggest: true, limit: 5 })
  return result.map(indexId => getItemId(indexId as number))
}

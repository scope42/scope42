/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod'
import { DeserializableDate, nullsafeOptional } from './commons'
import { ItemId } from './item-id'

export const Tag = z.string().min(1)

export const Aim42ItemType = z.enum(['issue', 'risk', 'improvement'])
export type Aim42ItemType = z.infer<typeof Aim42ItemType>

export const ItemType = Aim42ItemType.or(z.enum(['decision']))
export type ItemType = z.infer<typeof ItemType>

export const Comment = z.object({
  author: z.string().min(1),
  created: DeserializableDate.default(() => new Date()),
  content: z.string().min(1)
})
export type Comment = z.infer<typeof Comment>

/**
 * Common properties of all items.
 */
export function Item<T extends ItemType, I extends z.ZodType<ItemId, any, any>>(
  type: T,
  idSchema: I
) {
  return z.object({
    type: z.literal(type).default(type as any),
    id: idSchema,
    title: z.string().min(1),
    tags: z.array(Tag).default([]),
    created: DeserializableDate.default(() => new Date()),
    modified: DeserializableDate.default(() => new Date()),
    ticket: nullsafeOptional(z.string()),
    comments: z.array(Comment).default([]) // TODO move to details
  })
}

export function NewItem<T extends z.ZodRawShape>(item: z.ZodObject<T>) {
  return item.omit({ id: true })
}

/**
 * Details are extended data that is not kept in the store. It is only intended
 * for display on the item's detail page. Details may also be be subjected to
 * the search index.
 */
const ItemDetails = z.object({
  // description: nullsafeOptional(z.string()) // TODO
})

/**
 * This creates the schema for the content of an item file. It includes the item
 * details and omits the properties that are derivable from the file name and
 * location.
 */
export function ItemFileContent<T extends z.ZodRawShape>(item: z.ZodObject<T>) {
  return item.merge(ItemDetails).omit({ id: true, type: true })
}

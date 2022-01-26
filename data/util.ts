import { ItemId } from "./types"

export function getNumericId(id: ItemId): number {
  return parseInt(id.split("-")[1])
}
import { useNavigate } from 'react-router-dom'
import { PATHS } from './ItemLink'
import { ItemId } from '@scope42/data'
import { getTypeFromId } from '../../data/util'

export function useNavigateToItem() {
  const navigate = useNavigate()

  return (itemId: ItemId) => {
    const itemType = getTypeFromId(itemId)
    return navigate(`${PATHS[itemType]}/${itemId}`)
  }
}

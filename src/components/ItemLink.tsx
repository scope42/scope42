import { Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { ItemId, ItemType } from '../data/types'
import { ItemIcon } from './ItemIcon'

export const PATHS: { [type in ItemType]: string } = {
  issue: 'issues',
  improvement: 'improvements',
  risk: 'risks',
  decision: 'decisions'
}

export const ItemLink: React.VFC<{ id: ItemId }> = ({ id }) => {
  const item = useStore(state => state.items[id])

  if (!item) {
    return <Typography.Text type="danger">{id}</Typography.Text>
  }

  return (
    <>
      <ItemIcon type={item.type} />{' '}
      <Link to={`/${PATHS[item.type]}/${id}`}>{item.title}</Link>
    </>
  )
}

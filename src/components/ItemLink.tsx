import { Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { ItemId, ItemType } from '../data/types'
import { ItemIcon } from './ItemIcon'

const PATHS: { [type in ItemType]: string } = {
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
      <span style={{ position: 'relative', top: -2, marginRight: 8 }}>
        <ItemIcon type={item.type} size={16} />
      </span>
      <Link to={`/${PATHS[item.type]}/${id}`}>{item.title}</Link>
    </>
  )
}

export const ItemLinkList: React.VFC<{ ids: ItemId[] }> = ({ ids }) => {
  return (
    <>
      {ids.map((id, index) => (
        <>
          {index === 0 ? null : <span style={{ marginRight: 8 }}>,</span>}
          <ItemLink id={id} />
        </>
      ))}
    </>
  )
}

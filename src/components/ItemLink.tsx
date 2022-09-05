import { Descriptions, Popover, Tag, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { ItemId, ItemType } from '../data/types'
import { getSerialFromId, renderDate } from '../data/util'
import { ItemIcon } from './ItemIcon'
import { isActive, ItemStatus } from './Status'

export const PATHS: { [type in ItemType]: string } = {
  issue: 'issues',
  improvement: 'improvements',
  risk: 'risks',
  decision: 'decisions'
}

export const ItemLink: React.VFC<{ id: ItemId; noPopover?: boolean }> = ({
  id,
  noPopover
}) => {
  const item = useStore(state => state.items[id])

  if (!item) {
    return <Typography.Text type="danger">{id}</Typography.Text>
  }

  const link = (
    <Link to={`/${PATHS[item.type]}/${id}`}>
      <ItemIcon type={item.type} />{' '}
      <span
        style={{ textDecoration: isActive(item) ? 'none' : 'line-through' }}
      >
        {item.title}
      </span>{' '}
      <Typography.Text type="secondary">
        #{getSerialFromId(item.id)}
      </Typography.Text>
    </Link>
  )

  if (noPopover) {
    return link
  }

  return (
    <Popover
      content={
        <Descriptions
          style={{ width: 350 }}
          contentStyle={{ flexWrap: 'wrap' }}
          size="small"
          column={2}
        >
          <Descriptions.Item label="Status">
            <ItemStatus item={item} />
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {renderDate(item.created)}
          </Descriptions.Item>
          <Descriptions.Item label="Modified">
            {renderDate(item.modified)}
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {item.tags.map(tag => (
              <Tag key={tag} style={{ marginBottom: 2 }}>
                {tag}
              </Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      }
      title={
        <>
          <ItemIcon type={item.type} /> <Tag>{item.id}</Tag> {item.title}
        </>
      }
      trigger="hover"
    >
      {link}
    </Popover>
  )
}

import { Descriptions, Popover, Tag, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../data/store'
import { ItemId, ItemType, statusActive } from '@scope42/data'
import { getSerialFromId, renderDate } from '../../data/util'
import { ItemIcon } from '.'
import { ItemStatus } from './Status'

export const PATHS: { [type in ItemType]: string } = {
  issue: 'issues',
  improvement: 'improvements',
  risk: 'risks',
  decision: 'decisions'
}

export const ItemLink: React.FC<{ id: ItemId; noPopover?: boolean }> = ({
  id,
  noPopover
}) => {
  const item = useStore(state => state.items[id])

  if (!item) {
    return <Typography.Text type="danger">{id}</Typography.Text>
  }

  const titleStyle = {
    textDecoration: statusActive(item.status) ? 'none' : 'line-through'
  }
  const titleWords = item.title.split(' ')

  const link = (
    <Link to={`/${PATHS[item.type]}/${id}`}>
      <span style={{ whiteSpace: 'nowrap' }}>
        <ItemIcon type={item.type} />{' '}
        <span style={titleStyle}>{titleWords[0]}</span>
      </span>
      {titleWords.length > 1 ? (
        <span style={titleStyle}> {titleWords.slice(1).join(' ')}</span>
      ) : null}
      &nbsp;
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
          style={{ width: 400 }}
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
          <Descriptions.Item label={item.tags.length > 0 ? 'Tags' : undefined}>
            {item.tags.map(tag => (
              <Tag key={tag} style={{ marginBottom: 2 }}>
                {tag}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Modified">
            {renderDate(item.modified)}
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

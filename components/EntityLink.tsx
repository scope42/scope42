import React from 'react'
import { EntityId } from '../data'
import Link from 'next/link'
import { Badge } from 'antd'
import { useStore } from '../data/store'

export const IssueLink: React.FC<{id: EntityId}> = ({ id }) => {
  const issue = useStore(state => state.issues[id])
  return <><Badge color={'cyan'} /> <Link href={`/issues/${id}`}>{issue.title}</Link></>
}

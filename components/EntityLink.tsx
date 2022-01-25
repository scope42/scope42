import React from 'react'
import Link from 'next/link'
import { Badge } from 'antd'
import { useStore } from '../data/store'
import { IssueId } from '../data/types'

export const IssueLink: React.FC<{id: IssueId}> = ({ id }) => {
  const issue = useStore(state => state.issues[id])
  return <><Badge color={'cyan'} /> <Link href={`/issues/${id}`}>{issue.title}</Link></>
}

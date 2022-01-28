import React from 'react'
import Link from 'next/link'
import { Badge } from 'antd'
import { useStore } from '../data/store'
import { IssueId } from '../data/types'
import { IssueIcon } from './ItemIcon'

export const IssueLink: React.FC<{id: IssueId}> = ({ id }) => {
  const issue = useStore(state => state.issues[id])
  return <><span style={{position: "relative", top: 2, marginRight: 4}}><IssueIcon size={16} /></span><Link href={`/issues/${id}`}>{issue.title}</Link></>
}

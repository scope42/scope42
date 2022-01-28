import React from 'react'
import Link from 'next/link'
import { useStore } from '../data/store'
import { ImprovementId, IssueId, RiskId } from '../data/types'
import { ImprovementIcon, IssueIcon, RiskIcon } from './ItemIcon'

export const IssueLink: React.FC<{id: IssueId}> = ({ id }) => {
  const issue = useStore(state => state.issues[id])
  return <><span style={{position: "relative", top: 2, marginRight: 8}}><IssueIcon size={16} /></span><Link href={`/issues/${id}`}>{issue.title}</Link></>
}

export const ImprovementLink: React.FC<{id: ImprovementId}> = ({ id }) => {
  const improvement = useStore(state => state.improvements[id])
  return <><span style={{position: "relative", top: 2, marginRight: 8}}><ImprovementIcon size={16} /></span><Link href={`/improvements/${id}`}>{improvement.title}</Link></>
}

export const RiskLink: React.FC<{id: RiskId}> = ({ id }) => {
  const risk = useStore(state => state.risks[id])
  return <><span style={{position: "relative", top: 2, marginRight: 8}}><RiskIcon size={16} /></span><Link href={`/risks/${id}`}>{risk.title}</Link></>
}

import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { ImprovementId, IssueId, ItemId, RiskId } from '../data/types'
import { getTypeFromId } from '../data/util'
import { ImprovementIcon, IssueIcon, RiskIcon } from './ItemIcon'

export const IssueLink: React.FC<{ id: IssueId }> = ({ id }) => {
  const issue = useStore(state => state.issues[id])
  return (
    <>
      <span style={{ position: 'relative', top: -2, marginRight: 8 }}>
        <IssueIcon size={16} />
      </span>
      <Link to={`/issues/${id}`}>{issue.title}</Link>
    </>
  )
}

export const ImprovementLink: React.FC<{ id: ImprovementId }> = ({ id }) => {
  const improvement = useStore(state => state.improvements[id])
  return (
    <>
      <span style={{ position: 'relative', top: -2, marginRight: 8 }}>
        <ImprovementIcon size={16} />
      </span>
      <Link to={`/improvements/${id}`}>{improvement.title}</Link>
    </>
  )
}

export const RiskLink: React.FC<{ id: RiskId }> = ({ id }) => {
  const risk = useStore(state => state.risks[id])
  return (
    <>
      <span style={{ position: 'relative', top: -2, marginRight: 8 }}>
        <RiskIcon size={16} />
      </span>
      <Link to={`/risks/${id}`}>{risk.title}</Link>
    </>
  )
}

export const ItemLink: React.VFC<{ id: ItemId }> = ({ id }) => {
  const type = getTypeFromId(id)
  switch (type) {
    case 'issue':
      return <IssueLink id={id} />
    case 'risk':
      return <RiskLink id={id} />
    case 'improvement':
      return <ImprovementLink id={id} />
  }
  // return nothing so typescript will complain if switch is not exaustive anymore
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

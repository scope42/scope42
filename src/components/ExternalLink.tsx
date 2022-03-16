import { LinkOutlined } from '@ant-design/icons'
import React from 'react'

interface ExternalLinkProps {
  url: string
  noIcon?: boolean
}

export const ExternalLink: React.FC<ExternalLinkProps> = props => {
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer">
      {props.noIcon ? null : (
        <>
          <LinkOutlined />{' '}
        </>
      )}
      {props.children}
    </a>
  )
}

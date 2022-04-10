import Icon from '@ant-design/icons'
import React from 'react'

/** Adapted from https://commons.wikimedia.org/wiki/File:External.svg (public domain) */
const IconSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
  >
    <path
      fill="#FFF"
      stroke="#06D"
      strokeWidth="6"
      d="m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z"
    />
  </svg>
)

interface ExternalLinkProps {
  url: string
  noIcon?: boolean
  iconProps?: React.ComponentProps<typeof Icon>
}

export const ExternalLink: React.FC<ExternalLinkProps> = props => {
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer">
      {props.children}
      {props.noIcon ? null : (
        <>
          {' '}
          <Icon {...props.iconProps} component={IconSvg} />
        </>
      )}
    </a>
  )
}

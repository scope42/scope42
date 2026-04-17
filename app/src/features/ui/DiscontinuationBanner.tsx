import { Alert } from 'antd'
import React, { useState } from 'react'
import { ExternalLink } from './ExternalLink'

const DISMISSED_KEY = 'scope42.discontinuationBanner.dismissed'

export const DiscontinuationBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === 'true'
  )

  if (dismissed) {
    return null
  }

  return (
    <Alert
      type="warning"
      showIcon
      banner
      closable
      onClose={() => {
        localStorage.setItem(DISMISSED_KEY, 'true')
        setDismissed(true)
      }}
      message={
        <>
          <strong>The scope42 web app is being discontinued.</strong> scope42 is
          pivoting to a format-agnostic convention (YAML frontmatter), a
          standalone CLI linter, an Obsidian plugin, and agent skills. Follow
          progress in{' '}
          <ExternalLink url="https://github.com/scope42/scope42/issues/430">
            issue #430
          </ExternalLink>
          .
        </>
      }
    />
  )
}

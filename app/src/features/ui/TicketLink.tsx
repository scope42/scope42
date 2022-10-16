import { GithubOutlined, GitlabOutlined } from '@ant-design/icons'
import React, { ReactNode } from 'react'
import { ExternalLink } from '../ui'

type Tracker = 'unknown' | 'github' | 'gitlab' | 'jira'

interface Ticket {
  tracker: Tracker
  label: string
}

const ICONS: { [key in Tracker]?: ReactNode } = {
  github: <GithubOutlined />,
  gitlab: <GitlabOutlined />
}

export const TicketLink: React.FC<{ url: string }> = ({ url }) => {
  const { tracker, label } = parseTicketUrl(url)
  const icon = ICONS[tracker]
  return (
    <>
      {icon ? <span style={{ marginRight: 4 }}>{icon}</span> : null}
      <ExternalLink url={url}>{label}</ExternalLink>
    </>
  )
}

export function parseTicketUrl(url: string): Ticket {
  const githubMatch = /^https:\/\/github.com\/(.+)\/issues\/(\d+)$/.exec(url)
  if (githubMatch) {
    return {
      tracker: 'github',
      label: `${githubMatch[1]}#${githubMatch[2]}`
    }
  }
  const gitlabMatch = /^https:\/\/gitlab.com\/(.+)\/-\/issues\/(\d+)$/.exec(url)
  if (gitlabMatch) {
    return {
      tracker: 'gitlab',
      label: `${gitlabMatch[1]}#${gitlabMatch[2]}`
    }
  }
  const jiraMatch = /\/browse\/([A-Z]+-\d+)$/.exec(url)
  if (jiraMatch) {
    return {
      tracker: 'jira',
      label: `${jiraMatch[1]}`
    }
  }
  return {
    tracker: 'unknown',
    label: url
  }
}

import { parseTicketUrl } from './TicketLink'

describe('parseTicketUrl', () => {
  it('parses GitHub URL', () => {
    const ticket = parseTicketUrl('https://github.com/foo/bar/issues/42')
    expect(ticket).toEqual({ tracker: 'github', label: 'foo/bar#42' })
  })
  it('parses GitLab URL', () => {
    const ticket = parseTicketUrl('https://gitlab.com/foo/bar/-/issues/42')
    expect(ticket).toEqual({ tracker: 'gitlab', label: 'foo/bar#42' })
  })
  it('parses JIRA URL', () => {
    const ticket = parseTicketUrl('https://some-jira.com/browse/FOO-42')
    expect(ticket).toEqual({ tracker: 'jira', label: 'FOO-42' })
  })
  it('falls back to URL as label', () => {
    const ticket = parseTicketUrl('https://some-other-tracker.com/42')
    expect(ticket).toEqual({
      tracker: 'unknown',
      label: 'https://some-other-tracker.com/42'
    })
  })
})

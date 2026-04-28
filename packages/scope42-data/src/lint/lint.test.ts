import { lintWorkspace } from './index'
import { VirtualDirectoryContent, VirtualDirectoryHandle } from '../io/adapters'

function ws(content: VirtualDirectoryContent) {
  return new VirtualDirectoryHandle('root', content)
}

const CFG = `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`

// A valid Markdown issue file
function issue(extras = ''): string {
  return `---\nstatus: current\n${extras}---\n# My Issue\n\nBody text here.\n`
}

// ── Config errors ─────────────────────────────────────────────

test('throws when scope42.yaml is missing', async () => {
  await expect(lintWorkspace(ws({}))).rejects.toThrow(/scope42\.yaml/)
})

// ── Valid item — baseline ─────────────────────────────────────

test('no errors for a valid issue item', async () => {
  const result = await lintWorkspace(
    ws({ 'scope42.yaml': CFG, docs: { issues: { 'issue-1.md': issue() } } })
  )
  expect(result.diagnostics.filter(d => d.severity === 'error')).toHaveLength(0)
})

// ── Frontmatter checks ────────────────────────────────────────

test('error: no frontmatter in item file', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': CFG,
      docs: { issues: { 'issue-1.md': '# Title\n\nNo frontmatter.\n' } }
    })
  )
  expect(result.diagnostics).toHaveLength(1)
  expect(result.diagnostics[0].severity).toBe('error')
  expect(result.diagnostics[0].message).toMatch(/frontmatter/)
  expect(result.diagnostics[0].filePath).toMatch(/issue-1\.md/)
})

test('error: invalid status value', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': CFG,
      docs: {
        issues: { 'issue-1.md': '---\nstatus: bogus\n---\n# Title\n\nBody.\n' }
      }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.length).toBeGreaterThan(0)
  expect(errors[0].filePath).toMatch(/issue-1\.md/)
})

// ── Filename pattern ──────────────────────────────────────────

test('error: filename does not match fileNamePattern', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
validation:
  fileNamePattern: "issue-\\d+"
`,
      docs: { issues: { 'bad-name.md': issue() } }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.some(d => d.message.includes('pattern'))).toBe(true)
})

test('no error when filename matches fileNamePattern', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
validation:
  fileNamePattern: "issue-\\d+"
`,
      docs: { issues: { 'issue-42.md': issue() } }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.some(d => d.message.includes('pattern'))).toBe(false)
})

// ── H1 heading ────────────────────────────────────────────────

test('error: body does not start with a heading', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': CFG,
      docs: {
        issues: { 'issue-1.md': '---\nstatus: current\n---\nNot a heading.\n' }
      }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.some(d => d.message.includes('heading'))).toBe(true)
})

test('no heading error for Markdown # heading', async () => {
  const result = await lintWorkspace(
    ws({ 'scope42.yaml': CFG, docs: { issues: { 'issue-1.md': issue() } } })
  )
  expect(
    result.diagnostics.filter(d => d.message.includes('heading'))
  ).toHaveLength(0)
})

test('no heading error for AsciiDoc = heading', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.adoc"]
`,
      docs: {
        issues: {
          'issue-1.adoc': '---\nstatus: current\n---\n= My Issue\n\nBody.\n'
        }
      }
    })
  )
  expect(
    result.diagnostics.filter(d => d.message.includes('heading'))
  ).toHaveLength(0)
})

// ── Relation existence ────────────────────────────────────────

test('error: relation target does not exist', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': CFG,
      docs: {
        issues: { 'issue-1.md': issue('causedBy: ["nonexistent"]\n') }
      }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.some(d => d.message.includes('does not exist'))).toBe(true)
})

test('no error when relation target exists', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': `
version: 2
items:
  issue: docs/issues
  risk: docs/risks
include: ["*.md"]
`,
      docs: {
        issues: { 'issue-1.md': issue('causedBy: ["risk-1"]\n') },
        risks: { 'risk-1.md': '---\nstatus: potential\n---\n# Risk\n\nBody.\n' }
      }
    })
  )
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors.some(d => d.message.includes('does not exist'))).toBe(false)
})

// ── Warnings ──────────────────────────────────────────────────

test('warning: empty body', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': CFG,
      docs: { issues: { 'issue-1.md': '---\nstatus: current\n---\n' } }
    })
  )
  const warnings = result.diagnostics.filter(d => d.severity === 'warning')
  expect(warnings.some(d => d.message.includes('Empty body'))).toBe(true)
  // Empty body should not also produce a heading error
  const errors = result.diagnostics.filter(d => d.severity === 'error')
  expect(errors).toHaveLength(0)
})

test('warning: orphaned item with no relations', async () => {
  const result = await lintWorkspace(
    ws({ 'scope42.yaml': CFG, docs: { issues: { 'issue-1.md': issue() } } })
  )
  const warnings = result.diagnostics.filter(d => d.severity === 'warning')
  expect(warnings.some(d => d.message.includes('orphaned'))).toBe(true)
})

test('no orphan warning when item has relations', async () => {
  const result = await lintWorkspace(
    ws({
      'scope42.yaml': `
version: 2
items:
  issue: docs/issues
  risk: docs/risks
include: ["*.md"]
`,
      docs: {
        issues: { 'issue-1.md': issue('causedBy: ["risk-1"]\n') },
        risks: { 'risk-1.md': '---\nstatus: potential\n---\n# Risk\n\nBody.\n' }
      }
    })
  )
  const warnings = result.diagnostics.filter(d => d.severity === 'warning')
  expect(warnings.some(d => d.message.includes('orphaned'))).toBe(false)
})

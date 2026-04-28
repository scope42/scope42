import { runLint } from './lint'
import { VirtualDirectoryHandle, VirtualDirectoryContent } from '@scope42/data'

function ws(content: VirtualDirectoryContent) {
  return new VirtualDirectoryHandle('root', content)
}

const CLEAN_CFG = `
version: 2
items:
  issue: docs/issues
  risk: docs/risks
include: ["*.md"]
`

test('returns 0 for a clean workspace (no errors, no warnings)', async () => {
  // Both items have relations pointing to each other — no orphan warnings
  const root = ws({
    'scope42.yaml': CLEAN_CFG,
    docs: {
      issues: {
        'issue-1.md':
          '---\nstatus: current\ncausedBy: ["risk-1"]\n---\n# Issue\n\nBody.\n'
      },
      risks: {
        'risk-1.md':
          '---\nstatus: potential\ncausedBy: ["issue-1"]\n---\n# Risk\n\nBody.\n'
      }
    }
  })
  const exitCode = await runLint(root, 'text', () => {})
  expect(exitCode).toBe(0)
})

test('returns 1 for a workspace with only warnings', async () => {
  // Valid item but orphaned (no relations) → warning
  const root = ws({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`,
    docs: {
      issues: { 'issue-1.md': '---\nstatus: current\n---\n# Title\n\nBody.\n' }
    }
  })
  const exitCode = await runLint(root, 'text', () => {})
  expect(exitCode).toBe(1)
})

test('returns 2 for a workspace with errors', async () => {
  const root = ws({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`,
    docs: {
      issues: {
        'issue-1.md': '---\nstatus: bogus\n---\n# Title\n\nBody.\n'
      }
    }
  })
  const exitCode = await runLint(root, 'text', () => {})
  expect(exitCode).toBe(2)
})

test('text format includes file path in output', async () => {
  const root = ws({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`,
    docs: {
      issues: {
        'issue-1.md': '---\nstatus: bogus\n---\n# Title\n\nBody.\n'
      }
    }
  })
  const lines: string[] = []
  await runLint(root, 'text', (s: string) => lines.push(s))
  expect(lines.some(l => l.includes('issue-1.md'))).toBe(true)
})

test('json format outputs valid JSON with diagnostics array', async () => {
  const root = ws({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`,
    docs: {
      issues: { 'issue-1.md': '---\nstatus: current\n---\n# Title\n\nBody.\n' }
    }
  })
  const lines: string[] = []
  await runLint(root, 'json', (s: string) => lines.push(s))
  const parsed = JSON.parse(lines.join('\n'))
  expect(parsed).toHaveProperty('diagnostics')
  expect(Array.isArray(parsed.diagnostics)).toBe(true)
})

test('returns 2 and reports error when workspace config is missing', async () => {
  const root = ws({}) // no scope42.yaml → lintWorkspace throws
  const lines: string[] = []
  const exitCode = await runLint(root, 'text', (s: string) => lines.push(s))
  expect(exitCode).toBe(2)
  expect(lines.some(l => l.startsWith('Error:'))).toBe(true)
})

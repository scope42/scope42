import { VirtualDirectoryContent, VirtualDirectoryHandle } from './adapters'
import { Workspace } from './workspace'

function testWs(content: VirtualDirectoryContent) {
  return new Workspace(new VirtualDirectoryHandle('test-ws', content))
}

const CONFIG = `
version: 2
items:
  issue: docs/issues
  risk: docs/risks
  improvement: docs/improvements
  decision: docs/decisions
include: ["*.md"]
exclude: ["README.md"]
`

function item(status: string, extra = ''): string {
  return `---\nstatus: ${status}\n${extra}---\n# Title\n\nBody.\n`
}

test('missing scope42.yaml throws', async () => {
  await expect(testWs({}).readItems()).rejects.toThrow(/scope42\.yaml/)
})

test('invalid config throws', async () => {
  await expect(
    testWs({
      'scope42.yaml': 'items: {}\n'
    }).readItems()
  ).rejects.toThrow()
})

test('configured path missing in tree throws', async () => {
  await expect(
    testWs({
      'scope42.yaml': CONFIG
    }).readItems()
  ).rejects.toThrow(/docs\/issues/)
})

test('happy path: loads items across all four types', async () => {
  const items = await testWs({
    'scope42.yaml': CONFIG,
    docs: {
      issues: { '001 Foo.md': item('current') },
      risks: { '001 Bar.md': item('potential') },
      improvements: {
        '001 Baz.md': item('proposed', 'resolves: ["x"]\n')
      },
      decisions: { '001 Qux.md': item('accepted') }
    }
  }).readItems()

  expect(items).toHaveLength(4)
  const byType = Object.fromEntries(items.map(i => [i.type, i]))

  expect(byType.issue.id).toBe('001 Foo')
  expect(byType.issue.filePath).toBe('docs/issues/001 Foo.md')
  expect(byType.issue.frontmatter.status).toBe('current')
  expect(byType.issue.body.trim()).toBe('# Title\n\nBody.'.trim())

  expect(byType.risk.frontmatter.status).toBe('potential')
  expect(byType.improvement.frontmatter.resolves).toEqual(['x'])
  expect(byType.decision.frontmatter.status).toBe('accepted')
})

test('include/exclude filters apply to file names', async () => {
  const items = await testWs({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
exclude: ["README.md"]
`,
    docs: {
      issues: {
        '001 Foo.md': item('current'),
        'README.md': '# Readme only\n',
        'notes.txt': 'ignored'
      }
    }
  }).readItems()

  expect(items).toHaveLength(1)
  expect(items[0].id).toBe('001 Foo')
})

test('file in include without frontmatter throws with path', async () => {
  await expect(
    testWs({
      'scope42.yaml': CONFIG,
      docs: {
        issues: {
          '001 Foo.md': '# No frontmatter here\n'
        }
      }
    }).readItems()
  ).rejects.toThrow(/001 Foo\.md/)
})

test('invalid frontmatter reports file path', async () => {
  await expect(
    testWs({
      'scope42.yaml': CONFIG,
      docs: {
        issues: { '001 Foo.md': item('bogus') }
      }
    }).readItems()
  ).rejects.toThrow(/001 Foo\.md/)
})

test('multi-format: .md and .adoc parse identically', async () => {
  const items = await testWs({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md", "*.adoc"]
`,
    docs: {
      issues: {
        '001 Foo.md': item('current'),
        '002 Bar.adoc': item('current')
      }
    }
  }).readItems()

  expect(items).toHaveLength(2)
  const ids = items.map(i => i.id).sort()
  expect(ids).toEqual(['001 Foo', '002 Bar'])
  for (const it of items) expect(it.frontmatter.status).toBe('current')
})

test('non-configured types are skipped', async () => {
  const items = await testWs({
    'scope42.yaml': `
version: 2
items:
  issue: docs/issues
include: ["*.md"]
`,
    docs: {
      issues: { '001 Foo.md': item('current') }
    }
  }).readItems()

  expect(items).toHaveLength(1)
  expect(items[0].type).toBe('issue')
})

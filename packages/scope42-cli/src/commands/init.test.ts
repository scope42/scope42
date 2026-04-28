import { runInit } from './init'
import { VirtualDirectoryHandle, VirtualDirectoryContent } from '@scope42/data'

function ws(content: VirtualDirectoryContent) {
  return new VirtualDirectoryHandle('root', content)
}

test('returns 0 and creates scope42.yaml', async () => {
  const root = ws({})
  const lines: string[] = []
  const exitCode = await runInit(root, {}, (s: string) => lines.push(s))
  expect(exitCode).toBe(0)
  const file = await root.resolveFile('scope42.yaml')
  const text = await file.readText()
  expect(text).toContain('version: 2')
})

test('returns 1 when scope42.yaml already exists', async () => {
  const root = ws({ 'scope42.yaml': 'version: 2\n' })
  const exitCode = await runInit(root, {}, () => {})
  expect(exitCode).toBe(1)
})

test('returns 0 with --force even when file exists', async () => {
  const root = ws({ 'scope42.yaml': 'old: content\n' })
  const exitCode = await runInit(root, { force: true }, () => {})
  expect(exitCode).toBe(0)
  const file = await root.resolveFile('scope42.yaml')
  const text = await file.readText()
  expect(text).toContain('version: 2')
  expect(text).not.toContain('old: content')
})

import { initWorkspace } from './init'
import { VirtualDirectoryContent, VirtualDirectoryHandle } from './io/adapters'

function makeRoot(content: VirtualDirectoryContent) {
  return new VirtualDirectoryHandle('root', content)
}

test('creates scope42.yaml with default content when none exists', async () => {
  const root = makeRoot({})
  await initWorkspace(root)
  const file = await root.resolveFile('scope42.yaml')
  const text = await file.readText()
  expect(text).toContain('version: 2')
  expect(text).toContain('issue')
  expect(text).toContain('docs/issues')
})

test('throws when scope42.yaml already exists', async () => {
  const root = makeRoot({ 'scope42.yaml': 'version: 2\n' })
  await expect(initWorkspace(root)).rejects.toThrow(/already exists/)
})

test('overwrites existing scope42.yaml when force is true', async () => {
  const root = makeRoot({ 'scope42.yaml': 'old: content\n' })
  await initWorkspace(root, { force: true })
  const file = await root.resolveFile('scope42.yaml')
  const text = await file.readText()
  expect(text).toContain('version: 2')
  expect(text).not.toContain('old: content')
})

test('creates configured item directories', async () => {
  const root = makeRoot({})
  await initWorkspace(root)
  // Each configured directory should now exist
  const docs = await root.resolveDirectory('docs')
  await docs.resolveDirectory('issues')
  await docs.resolveDirectory('risks')
  await docs.resolveDirectory('improvements')
  await docs.resolveDirectory('adrs')
  // If no error thrown, directories exist
})

import { VirtualDirectoryContent, VirtualDirectoryHandle } from './adapters'
import { Workspace } from './workspace'

function testWs(content: VirtualDirectoryContent) {
  return new Workspace(new VirtualDirectoryHandle('test-ws', content))
}

test('empty workspace is ok', async () => {
  const items = await testWs({}).readItems()
  expect(items).toStrictEqual([])
})

test.skip('minimal item is parsed', async () => {
  const items = await testWs({
    issues: { 'issue-1.yml': 'title: Test' }
  }).readItems()
  expect(items).toStrictEqual([{ type: 'issue', id: 'issue-1', title: 'Test' }])
})

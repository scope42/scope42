import {
  DirectoryHandle,
  FileHandle,
  IndexedItems,
  Workspace
} from '@scope42/data'
import superjson from 'superjson'

export class DemoWorkspace extends Workspace {
  constructor() {
    super(new DemoWorkspaceDirectory())
  }

  override async readItemsIndexed(): Promise<IndexedItems> {
    const exampleJson = await fetch('/example.json').then(r => r.text())
    return superjson.parse(exampleJson) as IndexedItems
  }
}

class DemoWorkspaceDirectory implements DirectoryHandle {
  kind = 'directory' as const
  name = 'demo'

  async resolveFile(name: string): Promise<FileHandle> {
    return new DemoWorkspaceFile()
  }

  async resolveOrCreateFile(name: string): Promise<FileHandle> {
    return new DemoWorkspaceFile()
  }

  resolveDirectory(name: string): Promise<DirectoryHandle> {
    throw new Error('Method not implemented.')
  }

  async resolveOrCreateDirectory(name: string): Promise<DirectoryHandle> {
    return new DemoWorkspaceDirectory()
  }

  getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle> {
    throw new Error('Method not implemented.')
  }
}

class DemoWorkspaceFile implements FileHandle {
  kind = 'file' as const
  name = 'demo'

  async readText(): Promise<string> {
    return '' // this is needed for merge-writing items
  }

  async writeText(text: string): Promise<void> {
    // do nothing - in the demo, we are not in read-only mode but all writes are gracefully ignored
  }
}

import { loadItems } from '../src/data/persistence'
import superjson from 'superjson'
import fs from 'fs'

/**
 * Because of the module system, using native-file-system-adapter doesn't
 * work... In the future, we want to provide the ability to read in items from
 * the disk and other sources. This needs a re-structuring and multiple
 * packages. In the meantime, we use this minimal fake file system access
 * adapter.
 */

class File {
  constructor(private path: string) {
    this.name = path.split('/').at(-1)
  }

  name: string

  async text(): Promise<string> {
    return fs.readFileSync(this.path, 'utf8')
  }
}

class NodeFileHandle {
  constructor(private path: string) {
    this.name = path.split('/').at(-1)
  }

  kind = 'file'
  name: string

  async createWritable() {
    return {
      truncate: async () => {},
      write: async () => {},
      close: async () => {}
    }
  }

  async getFile() {
    return new File(this.path)
  }
}

class NodeDirectoryHandle {
  constructor(private path: string) {
    this.name = path.split('/').at(-1)
  }

  kind = 'directory'
  name: string

  async getFileHandle(fileName: string): Promise<NodeFileHandle> {
    // normally, this should check if the file exists
    return new NodeFileHandle(this.path + '/' + fileName)
  }

  async getDirectoryHandle(dirName: string): Promise<NodeDirectoryHandle> {
    const path = this.path + '/' + dirName
    if (fs.existsSync(path)) {
      return new NodeDirectoryHandle(path)
    }
    throw new Error()
  }

  async *values() {
    yield* fs
      .readdirSync(this.path, { withFileTypes: true })
      .filter(i => i.isDirectory() || i.isFile())
      .map(i =>
        i.isDirectory()
          ? this.getDirectoryHandle(i.name)
          : this.getFileHandle(i.name)
      )
  }
}

async function main() {
  const items = await loadItems(new NodeDirectoryHandle('./example') as any)
  fs.writeFileSync('./public/example.json', superjson.stringify(items))
}

main()

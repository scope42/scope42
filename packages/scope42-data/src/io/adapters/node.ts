import { DirectoryHandle, FileHandle } from './api'
import { promisify } from 'util'
import fs from 'fs'
import { basename } from 'path'

const esists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export class NodeDirectoryHandle implements DirectoryHandle {
  readonly kind = 'directory' as const
  readonly name: string
  #path: string

  constructor(path: string) {
    if (!fs.statSync(path).isDirectory()) {
      throw new Error(path + ' is not a directory')
    }
    this.#path = path
    this.name = basename(path)
  }

  async resolveFile(name: string): Promise<FileHandle> {
    return new NodeFileHandle(`${this.#path}/${name}`)
  }

  async resolveOrCreateFile(name: string): Promise<FileHandle> {
    const path = `${this.#path}/${name}`
    if (!(await esists(path))) {
      await writeFile(path, '')
    }
    return new NodeFileHandle(path)
  }

  async resolveDirectory(name: string): Promise<DirectoryHandle> {
    return new NodeDirectoryHandle(`${this.#path}/${name}`)
  }

  async resolveOrCreateDirectory(name: string): Promise<DirectoryHandle> {
    const path = `${this.#path}/${name}`
    if (!(await esists(path))) {
      await mkdir(path)
    }
    return new NodeDirectoryHandle(path)
  }

  async *getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle> {
    yield* fs
      .readdirSync(this.#path, { withFileTypes: true })
      .filter(i => i.isDirectory() || i.isFile())
      .map(i =>
        i.isDirectory()
          ? this.resolveDirectory(i.name)
          : this.resolveFile(i.name)
      )
  }
}

class NodeFileHandle implements FileHandle {
  readonly kind = 'file' as const
  readonly name: string
  #path: string

  constructor(path: string) {
    if (!fs.statSync(path).isFile()) {
      throw new Error(path + ' is not a file')
    }
    this.#path = path
    this.name = basename(path)
  }

  readText(): Promise<string> {
    return readFile(this.#path, 'utf8')
  }
  writeText(text: string): Promise<void> {
    return writeFile(this.#path, text, 'utf8')
  }
}

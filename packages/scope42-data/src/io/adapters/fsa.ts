import { DirectoryHandle, FileHandle } from './api'

export class FsaDirectoryHandle implements DirectoryHandle {
  kind = 'directory' as const
  name: string
  #delegate: FileSystemDirectoryHandle

  constructor(delegate: FileSystemDirectoryHandle) {
    this.#delegate = delegate
    this.name = delegate.name
  }

  async resolveFile(name: string): Promise<FileHandle> {
    const fileHandle = await this.#delegate.getFileHandle(name)
    return new FsaFileHandle(fileHandle)
  }

  async resolveOrCreateFile(name: string): Promise<FileHandle> {
    const fileHandle = await this.#delegate.getFileHandle(name, {
      create: true
    })
    return new FsaFileHandle(fileHandle)
  }

  async resolveDirectory(name: string): Promise<DirectoryHandle> {
    const directoryHandle = await this.#delegate.getDirectoryHandle(name)
    return new FsaDirectoryHandle(directoryHandle)
  }

  async resolveOrCreateDirectory(name: string): Promise<DirectoryHandle> {
    const directoryHandle = await this.#delegate.getDirectoryHandle(name, {
      create: true
    })
    return new FsaDirectoryHandle(directoryHandle)
  }

  async *getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle> {
    for await (const entry of this.#delegate.values()) {
      yield entry.kind === 'file'
        ? new FsaFileHandle(entry)
        : new FsaDirectoryHandle(entry)
    }
  }
}

export class FsaFileHandle implements FileHandle {
  kind = 'file' as const
  name: string
  #delegate: FileSystemFileHandle

  constructor(delegate: FileSystemFileHandle) {
    this.#delegate = delegate
    this.name = delegate.name
  }

  async readText(): Promise<string> {
    const file = await this.#delegate.getFile()
    return file.text()
  }

  async writeText(text: string): Promise<void> {
    const writable = await this.#delegate.createWritable()
    await writable.truncate(0) // override exsiting data
    await writable.write(text)
    await writable.close()
  }
}

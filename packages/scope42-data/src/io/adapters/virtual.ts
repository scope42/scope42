import { DirectoryHandle, FileHandle } from './api'

export type VirtualFileContent = string
export type VirtualDirectoryContent = {
  [name: string]: VirtualFileContent | VirtualDirectoryContent
}

function isFileContent(
  content: VirtualFileContent | VirtualDirectoryContent
): content is VirtualFileContent {
  return typeof content === 'string' || content instanceof String
}

function isDirectoryContent(
  content: VirtualFileContent | VirtualDirectoryContent
): content is VirtualDirectoryContent {
  return (
    typeof content === 'object' &&
    !Array.isArray(content) &&
    content !== null &&
    !(content instanceof String)
  )
}

export class VirtualDirectoryHandle implements DirectoryHandle {
  readonly kind = 'directory' as const

  constructor(
    public readonly name: string,
    public readonly content: VirtualDirectoryContent
  ) {
    if (!isDirectoryContent(content)) {
      throw new Error(`${name} has no valid directory content`)
    }
  }

  async resolveFile(name: string): Promise<FileHandle> {
    return new VirtualFileHandle(name, this.content)
  }

  async resolveOrCreateFile(name: string): Promise<FileHandle> {
    if (this.content[name] === undefined) {
      this.content[name] = ''
    }
    return new VirtualFileHandle(name, this.content)
  }

  async resolveDirectory(name: string): Promise<DirectoryHandle> {
    return new VirtualDirectoryHandle(name, this.content[name] as any) // contructor will check
  }

  async resolveOrCreateDirectory(name: string): Promise<DirectoryHandle> {
    if (this.content[name] === undefined) {
      this.content[name] = {}
    }
    return new VirtualDirectoryHandle(name, this.content[name] as any) // contructor will check
  }

  async *getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle> {
    for (const [childName, childContent] of Object.entries(this.content)) {
      yield isFileContent(childContent)
        ? new VirtualFileHandle(childName, this.content)
        : new VirtualDirectoryHandle(childName, childContent)
    }
  }
}

export class VirtualFileHandle implements FileHandle {
  readonly kind = 'file' as const

  constructor(
    public readonly name: string,
    // This is needed in order to mutate the file content
    private readonly containingDir: VirtualDirectoryContent
  ) {
    if (!isFileContent(containingDir[name])) {
      throw new Error(`${name} has no valid file content`)
    }
  }

  async readText(): Promise<string> {
    const content = this.containingDir[this.name]
    if (!isFileContent(content)) {
      throw new Error(`${this.name} has no valid file content`)
    }
    return content
  }

  async writeText(text: string): Promise<void> {
    this.containingDir[this.name] = text
  }
}

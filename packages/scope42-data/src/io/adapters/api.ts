export interface DirectoryHandle {
  kind: 'directory'
  name: string
  resolveFile(name: string): Promise<FileHandle>
  resolveOrCreateFile(name: string): Promise<FileHandle>
  resolveDirectory(name: string): Promise<DirectoryHandle>
  resolveOrCreateDirectory(name: string): Promise<DirectoryHandle>
  getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle>
}

export interface FileHandle {
  kind: 'file'
  name: string
  readText(): Promise<string>
  writeText(text: string): Promise<void>
}

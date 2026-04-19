/**
 * Abstract IO interface (DirectoryHandle, FileHandle) that all adapters
 * implement. The workspace loader is written against this interface so it
 * can run on any backing filesystem representation.
 */
export interface DirectoryHandle {
  readonly kind: 'directory'
  readonly name: string
  resolveFile(name: string): Promise<FileHandle>
  resolveOrCreateFile(name: string): Promise<FileHandle>
  resolveDirectory(name: string): Promise<DirectoryHandle>
  resolveOrCreateDirectory(name: string): Promise<DirectoryHandle>
  getContent(): AsyncIterableIterator<DirectoryHandle | FileHandle>
}

export interface FileHandle {
  readonly kind: 'file'
  readonly name: string
  readText(): Promise<string>
  writeText(text: string): Promise<void>
}

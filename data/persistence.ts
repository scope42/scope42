
export async function writeYaml(fileHandle: FileSystemFileHandle, data: object) {
  return await writeFile(fileHandle, JSON.stringify(data))
}

export async function writeFile(fileHandle: FileSystemFileHandle, contents: FileSystemWriteChunkType) {
  const writable = await fileHandle.createWritable()
  await writable.truncate(0) // override exsiting data
  await writable.write(contents)
  await writable.close()
}

export async function writeWorkspaceReadme(dirHandle: FileSystemDirectoryHandle) {
  const fileHandle = await dirHandle.getFileHandle("README.md", { create: true })
  await writeFile(fileHandle, `
# scope42 Workspace

This directory contains data for scope42, a web-based tool for software architecture improvement.
Click the link below and open this directory as a workspace.

## 🔗 [scope42](${window.location.origin})

<!-- This file is generated once when creating a workspace to give others a hint what is contained in this diretory. Feel free to edit or delete this. -->
`)
}
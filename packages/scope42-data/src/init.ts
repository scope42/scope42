import YAML from 'yaml'
import { DirectoryHandle } from './io/adapters'

const CONFIG_FILE = 'scope42.yaml'

const DEFAULT_CONFIG = {
  version: 2,
  items: {
    issue: 'docs/issues',
    risk: 'docs/risks',
    improvement: 'docs/improvements',
    decision: 'docs/adrs'
  },
  include: ['*.md', '*.adoc']
}

export async function initWorkspace(
  rootDirectory: DirectoryHandle,
  options: { force?: boolean } = {}
): Promise<void> {
  if (!options.force) {
    let exists = false
    try {
      await rootDirectory.resolveFile(CONFIG_FILE)
      exists = true
    } catch {
      // file does not exist — proceed
    }
    if (exists) {
      throw new Error(
        `${CONFIG_FILE} already exists. Pass { force: true } to overwrite.`
      )
    }
  }
  const file = await rootDirectory.resolveOrCreateFile(CONFIG_FILE)
  await file.writeText(YAML.stringify(DEFAULT_CONFIG))

  for (const dirPath of Object.values(DEFAULT_CONFIG.items)) {
    const segments = dirPath.split('/').filter(Boolean)
    let current: DirectoryHandle = rootDirectory
    for (const segment of segments) {
      current = await current.resolveOrCreateDirectory(segment)
    }
  }
}

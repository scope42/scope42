import { Command } from 'commander'
import path from 'path'
import { DirectoryHandle, initWorkspace } from '@scope42/data'
import { NodeDirectoryHandle } from '@scope42/data/node'

export function makeInitCommand(): Command {
  return new Command('init')
    .description('Initialize a new scope42 workspace')
    .argument('[path]', 'Path to the workspace root', '.')
    .option('--force', 'Overwrite existing scope42.yaml')
    .action(async (workspacePath: string, options: { force?: boolean }) => {
      const absPath = path.resolve(workspacePath)
      const rootDir = new NodeDirectoryHandle(absPath)
      const exitCode = await runInit(rootDir, options)
      if (exitCode !== 0) process.exit(exitCode)
    })
}

export async function runInit(
  rootDir: DirectoryHandle,
  options: { force?: boolean },
  out: (line: string) => void = s => process.stdout.write(s + '\n')
): Promise<number> {
  try {
    await initWorkspace(rootDir, options)
    out('Created scope42.yaml')
    return 0
  } catch (e) {
    out(`Error: ${(e as Error).message}`)
    return 1
  }
}

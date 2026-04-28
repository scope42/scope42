import { Command } from 'commander'
import path from 'path'
import { DirectoryHandle, LintResult, lintWorkspace } from '@scope42/data'
import { NodeDirectoryHandle } from '@scope42/data/node'

export function makeLintCommand(): Command {
  return new Command('lint')
    .description('Validate all scope42 items in a workspace')
    .argument('[path]', 'Path to the workspace root', '.')
    .option('--format <format>', 'Output format: text or json', 'text')
    .action(async (workspacePath: string, options: { format: string }) => {
      const absPath = path.resolve(workspacePath)
      const rootDir = new NodeDirectoryHandle(absPath)
      const exitCode = await runLint(rootDir, options.format as 'text' | 'json')
      process.exit(exitCode)
    })
}

export async function runLint(
  rootDir: DirectoryHandle,
  format: 'text' | 'json',
  out: (line: string) => void = s => process.stdout.write(s + '\n')
): Promise<number> {
  let result: LintResult
  try {
    result = await lintWorkspace(rootDir)
  } catch (e) {
    out(`Error: ${e instanceof Error ? e.message : String(e)}`)
    return 2
  }

  const { diagnostics } = result
  const errors = diagnostics.filter(d => d.severity === 'error')
  const warnings = diagnostics.filter(d => d.severity === 'warning')

  if (format === 'json') {
    out(JSON.stringify(result, null, 2))
  } else {
    for (const d of diagnostics) {
      const label = d.severity === 'error' ? 'error' : 'warn'
      out(`${d.filePath}: ${label}: ${d.message}`)
    }
    if (diagnostics.length > 0) out('')
    out(`${errors.length} error(s), ${warnings.length} warning(s)`)
  }

  if (errors.length > 0) return 2
  if (warnings.length > 0) return 1
  return 0
}

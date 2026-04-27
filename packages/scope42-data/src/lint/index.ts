import matter from 'gray-matter'
import picomatch from 'picomatch'
import YAML from 'yaml'
import {
  DecisionFrontmatterSchema,
  ImprovementFrontmatterSchema,
  IssueFrontmatterSchema,
  Item,
  ItemType,
  RiskFrontmatterSchema,
  WorkspaceConfigSchema
} from '../model'
import { DirectoryHandle, FileHandle } from '../io/adapters'

export type LintSeverity = 'error' | 'warning'

export interface LintDiagnostic {
  filePath: string
  severity: LintSeverity
  message: string
}

export interface LintResult {
  diagnostics: LintDiagnostic[]
}

const SCHEMAS_BY_TYPE = {
  issue: IssueFrontmatterSchema,
  risk: RiskFrontmatterSchema,
  improvement: ImprovementFrontmatterSchema,
  decision: DecisionFrontmatterSchema
}

export async function lintWorkspace(
  rootDirectory: DirectoryHandle
): Promise<LintResult> {
  const configFile = await rootDirectory.resolveFile('scope42.yaml')
  const configText = await configFile.readText()
  const configResult = WorkspaceConfigSchema.safeParse(
    YAML.parse(fixYamlBackslashes(configText))
  )
  if (!configResult.success) {
    throw new Error(`Invalid scope42.yaml: ${configResult.error.message}`)
  }
  const config = configResult.data

  const diagnostics: LintDiagnostic[] = []
  const isIncluded = makeFilter(config.include, config.exclude)

  interface RawItem {
    id: string
    filePath: string
    item: Item | null
    relations: string[]
  }
  const rawItems: RawItem[] = []

  for (const [type, dirPath] of Object.entries(config.items) as [
    ItemType,
    string | undefined
  ][]) {
    if (!dirPath) continue
    const dir = await resolveDirByPath(rootDirectory, dirPath)

    for await (const entry of dir.getContent()) {
      if (entry.kind !== 'file') continue
      if (!isIncluded(entry.name)) continue

      const filePath = `${dirPath}/${entry.name}`
      const id = stripExtension(entry.name)
      const text = await (entry as FileHandle).readText()
      const { data: rawFrontmatter, content: body } = matter(text)

      let item: Item | null = null

      if (Object.keys(rawFrontmatter).length === 0) {
        diagnostics.push({ filePath, severity: 'error', message: 'No frontmatter found' })
      } else {
        const schema = SCHEMAS_BY_TYPE[type]
        const parseResult = schema.safeParse(rawFrontmatter)
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            const fieldPath = issue.path.join('.') || type
            diagnostics.push({
              filePath,
              severity: 'error',
              message: `Invalid frontmatter: ${fieldPath} — ${issue.message}`
            })
          }
        } else {
          item = { id, type, frontmatter: parseResult.data, body, filePath } as Item
        }
      }

      if (config.validation.fileNamePattern && !config.validation.fileNamePattern.test(id)) {
        diagnostics.push({
          filePath,
          severity: 'error',
          message: `Filename "${id}" does not match required pattern`
        })
      }

      const headingDiag = checkHeading(body, filePath)
      if (headingDiag) diagnostics.push(headingDiag)

      if (body.trim() === '') {
        diagnostics.push({ filePath, severity: 'warning', message: 'Empty body' })
      }

      const relations = item
        ? extractRelations(item, config.validation.relationPattern)
        : []
      rawItems.push({ id, filePath, item, relations })
    }
  }

  const allIds = new Set(rawItems.map(r => r.id))

  // Build set of IDs that are referenced by at least one other item
  const referencedIds = new Set(rawItems.flatMap(r => r.relations))

  for (const { id, item, filePath, relations } of rawItems) {
    if (!item) continue

    const hasOutgoing = relations.length > 0
    const hasIncoming = referencedIds.has(id)
    if (!hasOutgoing && !hasIncoming) {
      diagnostics.push({ filePath, severity: 'warning', message: 'No relations (orphaned item)' })
    }

    for (const targetId of relations) {
      if (!allIds.has(targetId)) {
        diagnostics.push({
          filePath,
          severity: 'error',
          message: `Relation target "${targetId}" does not exist`
        })
      }
    }
  }

  return { diagnostics }
}

function checkHeading(body: string, filePath: string): LintDiagnostic | null {
  const firstNonBlank = body.split('\n').find(l => l.trim() !== '')
  if (!firstNonBlank) return null // empty body is a separate warning
  if (/^#\s+\S/.test(firstNonBlank) || /^=\s+\S/.test(firstNonBlank)) return null
  return {
    filePath,
    severity: 'error',
    message: 'Body does not start with a heading (expected Markdown # or AsciiDoc =)'
  }
}

function extractRelations(item: Item, relationPattern?: RegExp): string[] {
  const raw: string[] = []
  switch (item.type) {
    case 'issue':
    case 'risk':
      raw.push(...item.frontmatter.causedBy)
      break
    case 'improvement':
      raw.push(
        ...item.frontmatter.resolves,
        ...item.frontmatter.modifies,
        ...item.frontmatter.creates
      )
      break
    case 'decision':
      if (item.frontmatter.supersededBy) raw.push(item.frontmatter.supersededBy)
      raw.push(...item.frontmatter.assesses)
      break
  }
  if (!relationPattern) return raw
  return raw.flatMap(v => {
    const match = v.match(relationPattern)
    return match ? [match[1]] : []
  })
}

function makeFilter(include: string[], exclude: string[]): (name: string) => boolean {
  const includeMatch = picomatch(include)
  const excludeMatch = exclude.length > 0 ? picomatch(exclude) : () => false
  return name => includeMatch(name) && !excludeMatch(name)
}

async function resolveDirByPath(root: DirectoryHandle, relPath: string): Promise<DirectoryHandle> {
  const segments = relPath.split('/').filter(Boolean)
  let current = root
  for (const segment of segments) {
    try {
      current = await current.resolveDirectory(segment)
    } catch {
      throw new Error(`Configured path does not exist: ${relPath}`)
    }
  }
  return current
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(0, dot) : name
}

/**
 * Pre-process YAML text to fix invalid backslash escape sequences in
 * double-quoted strings. The YAML spec only allows specific escape sequences
 * (e.g. \\n, \\t, \\\\); unrecognized sequences like \\d throw a parse error.
 * This is common when regex patterns are written in double-quoted YAML strings
 * without doubling the backslash. We fix by doubling the backslash for any
 * escape sequence that is not recognized by YAML.
 */
function fixYamlBackslashes(text: string): string {
  // Characters that are valid YAML double-quote escape sequences
  const validYamlEscapeChars = new Set([
    '0', 'a', 'b', 't', 'n', 'v', 'f', 'r', 'e', '"', '/', '\\', 'N', '_', 'L', 'P',
    ' ', 'x', 'u', 'U'
  ])
  // Match double-quoted YAML strings, handling embedded escaped quotes
  return text.replace(/"((?:[^"\\]|\\[\s\S])*)"/g, (match, inner: string) => {
    const fixed = inner.replace(/\\(.)/g, (escSeq: string, c: string) => {
      if (validYamlEscapeChars.has(c)) return escSeq
      // Double the backslash so YAML will parse \d as literal backslash + d
      return '\\\\' + c
    })
    return '"' + fixed + '"'
  })
}

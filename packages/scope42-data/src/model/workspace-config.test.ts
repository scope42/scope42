import { WorkspaceConfigSchema } from './workspace-config'

const minimal = {
  items: { issue: 'docs/issues' },
  include: ['*.md']
}

describe('WorkspaceConfigSchema', () => {
  test('parses minimal valid config and applies defaults', () => {
    const parsed = WorkspaceConfigSchema.parse(minimal)
    expect(parsed.items.issue).toBe('docs/issues')
    expect(parsed.exclude).toEqual([])
    expect(parsed.validation).toEqual({
      fileNamePattern: undefined,
      relationPattern: undefined
    })
  })

  test('rejects empty include array', () => {
    expect(() =>
      WorkspaceConfigSchema.parse({ ...minimal, include: [] })
    ).toThrow()
  })

  test('rejects unknown top-level key', () => {
    expect(() =>
      WorkspaceConfigSchema.parse({ ...minimal, foo: 'bar' })
    ).toThrow()
  })

  test('rejects unknown key inside items', () => {
    expect(() =>
      WorkspaceConfigSchema.parse({
        ...minimal,
        items: { issue: 'docs/issues', foo: 'docs/foo' }
      })
    ).toThrow()
  })

  test('accepts all four item-type keys', () => {
    const parsed = WorkspaceConfigSchema.parse({
      items: {
        issue: 'i',
        risk: 'r',
        improvement: 'im',
        decision: 'd'
      },
      include: ['*.md']
    })
    expect(parsed.items).toEqual({
      issue: 'i',
      risk: 'r',
      improvement: 'im',
      decision: 'd'
    })
  })

  test('compiles fileNamePattern to RegExp', () => {
    const parsed = WorkspaceConfigSchema.parse({
      ...minimal,
      validation: { fileNamePattern: '[0-9]{3} .+' }
    })
    expect(parsed.validation.fileNamePattern).toBeInstanceOf(RegExp)
    expect(parsed.validation.fileNamePattern!.test('001 Foo')).toBe(true)
    expect(parsed.validation.fileNamePattern!.test('foo')).toBe(false)
  })

  test('compiles relationPattern to RegExp', () => {
    const parsed = WorkspaceConfigSchema.parse({
      ...minimal,
      validation: { relationPattern: '^x$' }
    })
    expect(parsed.validation.relationPattern).toBeInstanceOf(RegExp)
    expect(parsed.validation.relationPattern!.test('x')).toBe(true)
  })

  test('relationType produces the matching built-in pattern', () => {
    const parsed = WorkspaceConfigSchema.parse({
      ...minimal,
      validation: { relationType: 'markdown-link' }
    })
    expect(parsed.validation.relationPattern).toBeInstanceOf(RegExp)
    expect(
      parsed.validation.relationPattern!.test('[x](foo.md)')
    ).toBe(true)
  })

  test('rejects relationPattern and relationType together', () => {
    expect(() =>
      WorkspaceConfigSchema.parse({
        ...minimal,
        validation: {
          relationPattern: '^x$',
          relationType: 'markdown-link'
        }
      })
    ).toThrow()
  })

  test('rejects invalid regex syntax in fileNamePattern', () => {
    expect(() =>
      WorkspaceConfigSchema.parse({
        ...minimal,
        validation: { fileNamePattern: '[unterminated' }
      })
    ).toThrow(/Invalid regex/)
  })
})

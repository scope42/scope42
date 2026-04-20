import { IssueFrontmatterSchema } from './issue'
import { RiskFrontmatterSchema } from './risk'
import { ImprovementFrontmatterSchema } from './improvement'
import { DecisionFrontmatterSchema } from './decision'

describe('IssueFrontmatterSchema', () => {
  test('parses minimal valid frontmatter and applies defaults', () => {
    const parsed = IssueFrontmatterSchema.parse({ status: 'current' })
    expect(parsed.status).toBe('current')
    expect(parsed.tags).toEqual([])
    expect(parsed.causedBy).toEqual([])
  })

  test('rejects invalid status', () => {
    expect(() => IssueFrontmatterSchema.parse({ status: 'bogus' })).toThrow()
  })

  test('rejects missing status', () => {
    expect(() => IssueFrontmatterSchema.parse({})).toThrow()
  })

  test('passes through unknown fields (e.g. ticket)', () => {
    const parsed = IssueFrontmatterSchema.parse({
      status: 'current',
      ticket: 'https://x',
      obsidianCustom: 42
    }) as Record<string, unknown>
    expect(parsed.ticket).toBe('https://x')
    expect(parsed.obsidianCustom).toBe(42)
  })

  test('keeps relations as strings', () => {
    const parsed = IssueFrontmatterSchema.parse({
      status: 'current',
      causedBy: ['[foo](foo.md)', 'issue-2']
    })
    expect(parsed.causedBy).toEqual(['[foo](foo.md)', 'issue-2'])
  })
})

describe('RiskFrontmatterSchema', () => {
  test('parses minimal valid frontmatter', () => {
    const parsed = RiskFrontmatterSchema.parse({ status: 'potential' })
    expect(parsed.status).toBe('potential')
    expect(parsed.causedBy).toEqual([])
  })

  test('rejects invalid status', () => {
    expect(() =>
      RiskFrontmatterSchema.parse({ status: 'current-ish' })
    ).toThrow()
  })
})

describe('ImprovementFrontmatterSchema', () => {
  test('parses valid frontmatter', () => {
    const parsed = ImprovementFrontmatterSchema.parse({
      status: 'proposed',
      resolves: ['issue-1']
    })
    expect(parsed.resolves).toEqual(['issue-1'])
    expect(parsed.modifies).toEqual([])
    expect(parsed.creates).toEqual([])
  })

  test('rejects empty resolves array', () => {
    expect(() =>
      ImprovementFrontmatterSchema.parse({
        status: 'proposed',
        resolves: []
      })
    ).toThrow()
  })

  test('rejects missing resolves', () => {
    expect(() =>
      ImprovementFrontmatterSchema.parse({ status: 'proposed' })
    ).toThrow()
  })
})

describe('DecisionFrontmatterSchema', () => {
  test('parses minimal frontmatter', () => {
    const parsed = DecisionFrontmatterSchema.parse({ status: 'proposed' })
    expect(parsed.status).toBe('proposed')
    expect(parsed.assesses).toEqual([])
  })

  test('coerces decided ISO string to Date', () => {
    const parsed = DecisionFrontmatterSchema.parse({
      status: 'accepted',
      decided: '2025-01-15T00:00:00.000Z'
    })
    expect(parsed.decided).toBeInstanceOf(Date)
    expect(parsed.decided!.toISOString()).toBe('2025-01-15T00:00:00.000Z')
  })

  test('accepts supersededBy as plain string', () => {
    const parsed = DecisionFrontmatterSchema.parse({
      status: 'superseded',
      supersededBy: '[next](002 Next.md)'
    })
    expect(parsed.supersededBy).toBe('[next](002 Next.md)')
  })

  test('rejects invalid status', () => {
    expect(() => DecisionFrontmatterSchema.parse({ status: 'bogus' })).toThrow()
  })
})

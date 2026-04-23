import { RELATION_TYPE_PATTERNS } from './relation-patterns'

const md = RELATION_TYPE_PATTERNS['markdown-link']
const adoc = RELATION_TYPE_PATTERNS['asciidoc-link']
const obs = RELATION_TYPE_PATTERNS['obsidian-link']

describe('markdown-link pattern', () => {
  test.each([
    ['[x](foo.md)', 'foo.md'],
    ['[](foo.md)', 'foo.md'],
    ['[x](../a/b.md)', '../a/b.md'],
    ['[A title](001 Foo.md)', '001 Foo.md']
  ])('%s captures %s', (input, target) => {
    const m = input.match(md)
    expect(m).not.toBeNull()
    expect(m![1]).toBe(target)
  })

  test.each(['[x]', '[x](foo)tail', 'head[x](foo)', 'plain text', '(foo.md)'])(
    'rejects %s',
    input => {
      expect(md.test(input)).toBe(false)
    }
  )
})

describe('asciidoc-link pattern', () => {
  test.each([
    ['<<foo>>', 'foo'],
    ['<<foo,Text>>', 'foo'],
    ['<<foo bar>>', 'foo bar']
  ])('%s captures %s', (input, target) => {
    const m = input.match(adoc)
    expect(m).not.toBeNull()
    expect(m![1]).toBe(target)
  })

  test.each(['<<foo>>tail', '<< >>', '<<foo', 'head<<foo>>'])(
    'rejects %s',
    input => {
      expect(adoc.test(input)).toBe(false)
    }
  )
})

describe('obsidian-link pattern', () => {
  test.each([
    ['[[issue-1]]', 'issue-1'],
    ['[[issue-1|Alias]]', 'issue-1'],
    ['[[a/b/c]]', 'a/b/c']
  ])('%s captures %s', (input, target) => {
    const m = input.match(obs)
    expect(m).not.toBeNull()
    expect(m![1]).toBe(target)
  })

  test.each(['[[]]', '[[a|b|c]]', '[[a]]tail', '[a]', 'foo'])(
    'rejects %s',
    input => {
      expect(obs.test(input)).toBe(false)
    }
  )
})

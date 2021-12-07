import { improvements, issues, risks } from './types'
import fs from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

export type EntityId = string
export type Issue = issues & { body: string }
export type Risk = risks & { body: string }
export type Improvement = improvements & { body: string }

export class NotFoundError extends Error {}

const basePath = process.env.WORKSPACE || ''

function loadFile(collection: string, id: string): any {
  const path = resolve(basePath, collection, id + '.yml')
  if (!fs.existsSync(path)) {
    throw new NotFoundError()
  }
  const data = fs.readFileSync(path, 'utf8')
  const obj = yaml.load(data) as any
  obj.id = id
  return obj
}

function loadFiles(collection: string): any[] {
  return fs.readdirSync(resolve(basePath, collection))
      .filter(f => f.endsWith('.yml'))
      .map(f => f.substr(0, f.length - 4))
      .filter(f => f !== '')
      .map(f => loadFile(collection, f))
}

export function loadIssues(): Issue[] {
  return loadFiles('issues')
}

export function loadIssue(id: string): Issue {
  return loadFile('issues', id)
}

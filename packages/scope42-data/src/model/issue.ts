import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { IssueId } from './item-id'

export const IssueStatus = z.enum(['current', 'resolved', 'discarded'])
export type IssueStatus = z.infer<typeof IssueStatus>

export const Issue = Item('issue', IssueId).extend({
  status: IssueStatus.default('current'),
  description: nullsafeOptional(z.string()), // TODO move to details
  causedBy: z.array(IssueId).default([])
})
export type Issue = z.infer<typeof Issue>

export const IssueFileContent = ItemFileContent(Issue)
export type IssueFileContent = z.infer<typeof IssueFileContent>

export const NewIssue = NewItem(Issue)
export type NewIssue = z.infer<typeof NewIssue>

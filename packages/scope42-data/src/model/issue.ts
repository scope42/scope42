import { z } from 'zod'
import { nullsafeOptional } from './commons'
import { Item, ItemFileContent, NewItem } from './item-base'
import { IssueId } from './item-id'

export const IssueStatuses = ['current', 'resolved', 'discarded'] as const

export type IssueStatus = typeof IssueStatuses[number]

export const IssueSchema = Item('issue', IssueId).extend({
  status: z.enum(IssueStatuses),
  description: nullsafeOptional(z.string()), // TODO move to details
  causedBy: z.array(IssueId).default([])
})
export type Issue = z.infer<typeof IssueSchema>

export const IssueFileContentSchema = ItemFileContent(IssueSchema)
export type IssueFileContent = z.infer<typeof IssueFileContentSchema>

export const NewIssueSchema = NewItem(IssueSchema)
export type NewIssue = z.infer<typeof NewIssueSchema>

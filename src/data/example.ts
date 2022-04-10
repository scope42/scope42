import dayjs from 'dayjs'
import { AppState } from './store'
import { Decision, Improvement, Issue, Risk } from './types'

export const EXAMPLE_DATA: Pick<AppState, 'items'> = {
  items: {
    'issue-1': Issue.parse({
      type: 'issue',
      id: 'issue-1',
      title: 'Issue 1',
      body: 'Das ist ein Test',
      tags: ['frontend'],
      comments: [
        {
          author: 'Erik',
          content: 'This is a comment',
          created: dayjs().subtract(1, 'day').toDate()
        },
        { author: 'Erik', content: 'This is another comment' }
      ]
    }),
    'issue-2': Issue.parse({
      type: 'issue',
      id: 'issue-2',
      title: 'Issue 2',
      body: 'Das ist ein Test',
      causedBy: ['issue-1'],
      tags: ['backend']
    }),
    'issue-3': Issue.parse({
      type: 'issue',
      id: 'issue-3',
      title: 'Issue 3',
      body: 'Das ist ein Test',
      causedBy: ['issue-2'],
      tags: ['backend', 'urgent']
    }),
    'risk-1': Risk.parse({
      type: 'risk',
      id: 'risk-1',
      title: 'Risk 1',
      body: 'Das ist ein Test'
    }),
    'risk-2': Risk.parse({
      type: 'risk',
      id: 'risk-2',
      title: 'Risk 1',
      body: 'Das ist ein Test'
    }),
    'improvement-1': Improvement.parse({
      type: 'improvement',
      id: 'improvement-1',
      title: 'Improvement 1',
      body: 'Das ist ein Test',
      resolves: ['risk-1']
    }),
    'improvement-2': Improvement.parse({
      type: 'improvement',
      id: 'improvement-2',
      title: 'Improvement 2',
      body: 'Das ist ein Test',
      resolves: ['issue-1']
    }),
    'improvement-3': Improvement.parse({
      type: 'improvement',
      id: 'improvement-3',
      title: 'Improvement 3',
      body: 'Das ist ein Test',
      resolves: ['issue-2', 'issue-3']
    }),
    'improvement-4': Improvement.parse({
      type: 'improvement',
      id: 'improvement-4',
      title: 'Improvement 4',
      body: 'Das ist ein Test',
      resolves: ['issue-2', 'risk-2']
    }),
    'improvement-5': Improvement.parse({
      type: 'improvement',
      id: 'improvement-5',
      title: 'Improvement 5',
      body: 'Das ist ein Test',
      resolves: ['issue-2']
    }),
    'improvement-6': Improvement.parse({
      type: 'improvement',
      id: 'improvement-6',
      title: 'Improvement 6',
      body: 'Das ist ein Test',
      resolves: ['issue-2']
    }),
    'decision-1': Decision.parse({
      type: 'decision',
      id: 'decision-1',
      title: 'Decision 1',
      deciders: ['Erik'],
      judges: ['improvement-1', 'improvement-2'],
      context:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
      options: [
        {
          title: 'Improvement 1',
          pros: '* good, because...\n* good, because...',
          cons: '* bad, because...\n* bad, because...'
        },
        {
          title: 'Improvement 2',
          pros: '* good, because...\n* good, because...'
        },
        { title: 'Do nothing', cons: '* bad, because...\n* bad, because...' }
      ],
      outcome: {
        optionIndex: 1,
        rationale:
          'Because ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
        positiveConsequences: '* Foo\n* Bar',
        negativeConsequences: '* Foo\n* Bar'
      }
    })
  }
}

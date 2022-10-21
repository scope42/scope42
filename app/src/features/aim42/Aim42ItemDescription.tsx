import { Aim42ItemType } from '@scope42/data'
import { Aim42Card } from '.'
import { commonTerminology } from '@scope42/structured-aim42/lib/introduction/how-does-aim42-work/common-terminology'
import { AtomicNode } from '@scope42/structured-aim42/lib/types'

/**
 * The only table in this section defines common terms, including item types.
 * Each row has two columns - the term on the left and the definition in the right.
 */
const TABLE = commonTerminology.children.find(
  (c): c is AtomicNode => c.type === 'table'
)

const TABLE_KEY: Record<Aim42ItemType, string> = {
  issue: 'Issue',
  improvement: 'Improvement',
  risk: 'Risk'
}

/**
 * Extracts the value (right column) from the table for the given key.
 *
 * This approach is kind of brittle. In the future, we may want to expose the
 * table cell contents directly from structured-aim42.
 */
function getTableValue(tableKey: string) {
  if (!TABLE) {
    return null
  }
  const regex = new RegExp(
    `<tr>\\s*?<td .*?>.*<strong>${tableKey}</strong>.*?</td>\\s*?<td .*?>\\s*?<p .*?>(.*?)</p>\\s*?</td>\\s*?</tr>`,
    'gs'
  )
  const value = regex.exec(TABLE.content)?.[1]
  return value
}

export const Aim42ItemDescription: React.FC<{ type: Aim42ItemType }> = ({
  type
}) => {
  const tableKey = TABLE_KEY[type]
  const tableValue = getTableValue(tableKey)

  if (!tableValue) {
    return null
  }

  return (
    <Aim42Card
      title={tableKey}
      content={tableValue}
      attributionSectionId={commonTerminology.id}
    />
  )
}

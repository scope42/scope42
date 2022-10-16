import { CardProps, Tag, Tooltip } from 'antd'
import { Aim42Attribution } from '.'
import { AttributionCard } from '../ui'
import { Aim42Content } from './Aim42Content'

interface Aim42CardProps extends CardProps {
  content: string
  attributionSectionId?: string
}

export const Aim42Card: React.FC<Aim42CardProps> = props => {
  const { content, attributionSectionId, ...cardProps } = props
  return (
    <AttributionCard
      attribution={<Aim42Attribution sectionId={attributionSectionId} />}
      {...cardProps}
      extra={
        <Tooltip title="This content is included from the aim42 Method Reference. If you want to read more, click on the source link below.">
          <Tag style={{ cursor: 'help' }} color="blue">
            aim42
          </Tag>
        </Tooltip>
      }
    >
      <Aim42Content html={content} />
    </AttributionCard>
  )
}

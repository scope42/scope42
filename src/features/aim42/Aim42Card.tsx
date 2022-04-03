import { Card, CardProps, Tag, Tooltip, Typography } from 'antd'
import { Aim42Attribution } from '.'
import { Aim42Content } from './Aim42Content'

interface Aim42CardProps extends CardProps {
  content: string
  attributionSectionId?: string
}

export const Aim42Card: React.VFC<Aim42CardProps> = props => {
  const { content, attributionSectionId, ...cardProps } = props
  return (
    <>
      <Card
        {...cardProps}
        extra={
          <Tooltip title="This content is included from the aim42 Method Reference. If you want to read more, click on the source link below. You can improve this content by contributing directly to aim42.">
            <Tag style={{ cursor: 'help' }} color="blue">
              aim42
            </Tag>
          </Tooltip>
        }
      >
        <Aim42Content html={content} />
      </Card>
      <Typography.Text type="secondary" style={{ fontSize: '80%' }}>
        Source: <Aim42Attribution sectionId={attributionSectionId} />
      </Typography.Text>
    </>
  )
}

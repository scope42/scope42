import { Card, CardProps, Typography } from 'antd'

export interface AttributionCardProps extends CardProps {
  attribution: React.ReactNode
}

export const AttributionCard: React.FC<AttributionCardProps> = props => {
  const { attribution, ...cardProps } = props
  return (
    <>
      <Card {...cardProps} />
      <Typography.Text type="secondary" style={{ fontSize: '80%' }}>
        Source: {attribution}
      </Typography.Text>
    </>
  )
}

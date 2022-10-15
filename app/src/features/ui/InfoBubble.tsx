import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export const InfoBubble: React.FC = props => {
  return (
    <Tooltip title={props.children}>
      <InfoCircleOutlined style={{ cursor: 'help' }} />
    </Tooltip>
  )
}

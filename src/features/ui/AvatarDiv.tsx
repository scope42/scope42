import { Tooltip } from 'antd'
import { ComponentProps } from 'react'

export type AvatarDivProps = ComponentProps<'div'> & {
  avatar: React.ReactNode
  tooltip?: React.ReactNode
}

export const AvatarDiv: React.FC<AvatarDivProps> = props => {
  const { avatar, tooltip, style, ...restProps } = props
  return (
    <div style={{ display: 'flex', gap: 8, ...style }} {...restProps}>
      {props.tooltip ? (
        <Tooltip title={props.tooltip}>
          <div style={{ cursor: 'help' }}>{props.avatar}</div>
        </Tooltip>
      ) : (
        props.avatar
      )}
      <div>{props.children}</div>
    </div>
  )
}

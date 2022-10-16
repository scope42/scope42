import { ItemType } from '../data/types'
import Icon from '@ant-design/icons'

type IconProps = React.ComponentProps<typeof Icon>

const IssueSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="0 50 50 100 100 50 50 0" fill="red" />
  </svg>
)

const ImprovementSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="50" fill="green" />
  </svg>
)

const RiskSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="0 100 50 0 100 100" fill="orange" />
  </svg>
)

const DecisionSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="50 0 2 35 21 90 79 90 98 35 50 0" fill="BlueViolet" />
  </svg>
)

export const IssueIcon: React.FC<IconProps> = props => (
  <Icon {...props} component={IssueSvg} />
)

export const ImprovementIcon: React.FC<IconProps> = props => (
  <Icon {...props} component={ImprovementSvg} />
)

export const RiskIcon: React.FC<IconProps> = props => (
  <Icon {...props} component={RiskSvg} />
)

export const DecisionIcon: React.FC<IconProps> = props => (
  <Icon {...props} component={DecisionSvg} />
)

export const ItemIcon: React.FC<{ type: ItemType } & IconProps> = props => {
  const { type, ...restProps } = props
  switch (type) {
    case 'issue':
      return <IssueIcon {...restProps} />
    case 'risk':
      return <RiskIcon {...restProps} />
    case 'improvement':
      return <ImprovementIcon {...restProps} />
    case 'decision':
      return <DecisionIcon {...restProps} />
  }
  // return nothing so typescript will complain if switch is not exaustive anymore
}

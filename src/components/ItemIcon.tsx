
const DEFAULT_SIZE = 20

export const IssueIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <img src={process.env.PUBLIC_URL + '/issue.svg'} alt="Issue" height={size} width={size} />
}

export const ImprovementIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <img src={process.env.PUBLIC_URL + '/improvement.svg'} alt="Improvement" height={size} width={size} />
}

export const RiskIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <img src={process.env.PUBLIC_URL + '/risk.svg'} alt="Risk" height={size} width={size} />
}
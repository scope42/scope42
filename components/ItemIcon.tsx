import Image from 'next/image'

const DEFAULT_SIZE = 20

export const IssueIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <Image src="/issue.svg" alt="Issue" height={size} width={size} />
}

export const ImprovementIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <Image src="/improvement.svg" alt="Improvement" height={size} width={size} />
}

export const RiskIcon: React.FC<{size?: number}> = ({size = DEFAULT_SIZE}) => {
  return <Image src="/risk.svg" alt="Risk" height={size} width={size} />
}
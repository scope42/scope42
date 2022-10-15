import { Atomic, Section } from '@scope42/structured-aim42/lib/types'
import { Aim42Card } from './Aim42Card'

interface Aim42SectionCardProps {
  section: Atomic<Section>
}

export const Aim42SectionCard: React.VFC<Aim42SectionCardProps> = props => {
  const { section } = props
  return (
    <Aim42Card
      content={section.content}
      title={section.titlePlain}
      attributionSectionId={section.id}
    />
  )
}

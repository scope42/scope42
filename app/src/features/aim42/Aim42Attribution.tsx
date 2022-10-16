import { ExternalLink } from '../ui'

export const Aim42Attribution: React.FC<{ sectionId?: string }> = ({
  sectionId
}) => {
  const url = 'https://aim42.github.io/' + (sectionId ? '#' + sectionId : '')
  return (
    <>
      <ExternalLink url={url}>aim42 Method Reference</ExternalLink> by{' '}
      <ExternalLink url="https://www.gernotstarke.de/">
        Gernot Starke
      </ExternalLink>{' '}
      and{' '}
      <ExternalLink url="https://github.com/aim42/aim42/graphs/contributors">
        community contributors
      </ExternalLink>
      , used under{' '}
      <ExternalLink url="https://creativecommons.org/licenses/by-sa/4.0/">
        CC BY-SA
      </ExternalLink>
    </>
  )
}

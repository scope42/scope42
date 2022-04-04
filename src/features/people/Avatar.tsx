import Avvvatars from 'avvvatars-react'

export const Avatar: React.VFC<{ name: string }> = ({ name }) => {
  // eslint-disable-next-line react/style-prop-object
  return <Avvvatars value={name} style="shape" />
}

import Avvvatars from 'avvvatars-react'

export const Avatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size
}) => {
  // eslint-disable-next-line react/style-prop-object
  return <Avvvatars value={name} style="shape" size={size} />
}

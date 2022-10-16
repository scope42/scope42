import { Avatar } from './Avatar'

export const Person: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Avatar name={name} size={24} />
      {name}
    </div>
  )
}

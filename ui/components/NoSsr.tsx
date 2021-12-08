import { useEffect, useState } from 'react'

export const NoSsr: React.FC = props => {
  const [isClient, setClient] = useState(false)
  useEffect(() => {
    setClient(true)
  }, [])
  return isClient ? <>{props.children}</> : null
}

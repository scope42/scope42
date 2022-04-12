import mermaid from 'mermaid'
import { useState, useEffect } from 'react'

let serial = 0

const Mermaid: React.FC<{ children: string }> = ({ children }) => {
  const [renderResult, setRenderResult] = useState<string>()

  useEffect(() => {
    mermaid.render(`mermaid-${++serial}`, children, svg => setRenderResult(svg))
  }, [children, setRenderResult])

  if (!renderResult) {
    return null
  }

  return <div dangerouslySetInnerHTML={{ __html: renderResult }}></div>
}

export default Mermaid

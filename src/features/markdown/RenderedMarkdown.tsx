import ReactMarkdown from 'react-markdown'

export const RenderedMarkdown: React.FC<{ children: string }> = props => {
  return <ReactMarkdown>{props.children}</ReactMarkdown>
}

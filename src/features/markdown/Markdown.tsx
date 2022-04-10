import ReactMarkdown from 'react-markdown'

export const Markdown: React.FC<{ children: string }> = props => {
  return <ReactMarkdown>{props.children}</ReactMarkdown>
}

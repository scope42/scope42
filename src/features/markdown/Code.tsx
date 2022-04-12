import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps
} from 'react-syntax-highlighter'

const Code: React.FC<SyntaxHighlighterProps> = props => {
  return <SyntaxHighlighter PreTag="div" {...props} />
}

export default Code

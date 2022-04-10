import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../../components/ExternalLink'
import styles from './Markdown.module.css'

const COMPONENTS: ReactMarkdownOptions['components'] = {
  a({ node, children, href, ...restProps }) {
    return href ? (
      <ExternalLink url={href}>{children}</ExternalLink>
    ) : (
      <a {...restProps}>{children}</a>
    )
  }
}

export const Markdown: React.FC<{ children: string }> = props => {
  return (
    <ReactMarkdown
      className={styles.markdown}
      remarkPlugins={[remarkGfm]}
      components={COMPONENTS}
    >
      {props.children}
    </ReactMarkdown>
  )
}

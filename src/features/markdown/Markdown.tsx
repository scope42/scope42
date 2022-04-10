import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../../components/ExternalLink'
import styles from './Markdown.module.css'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import remarkDirective from 'remark-directive'
import { ItemLink } from '../../components/ItemLink'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Typography } from 'antd'
import { Mermaid } from './Mermaid'

const remarkItemLink: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, node => {
      if (node.type === 'textDirective' && node.name === 'link') {
        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}
        const itemId = attributes.id

        if (!itemId) return

        data.hName = 'scope42-item-link'
        data.hProperties = { 'item-id': itemId }
      }
    })
  }
}

const COMPONENTS: Components = {
  a({ node, children, href, ...restProps }) {
    return href ? (
      <ExternalLink url={href}>{children}</ExternalLink>
    ) : (
      <a {...restProps}>{children}</a>
    )
  },
  // @ts-ignore
  'scope42-item-link'(props) {
    return <ItemLink id={props['item-id']} />
  },
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return <Typography.Text code>{children}</Typography.Text>
    }
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    const code = String(children).replace(/\n$/, '')

    if (language === 'mermaid') {
      return <Mermaid>{code}</Mermaid>
    }

    return (
      <SyntaxHighlighter
        children={code}
        language={language}
        PreTag="div"
        {...props}
      />
    )
  }
}

export const Markdown: React.FC<{ children: string }> = props => {
  return (
    <ReactMarkdown
      className={styles.markdown}
      remarkPlugins={[remarkGfm, remarkDirective, remarkItemLink]}
      components={COMPONENTS}
    >
      {props.children}
    </ReactMarkdown>
  )
}

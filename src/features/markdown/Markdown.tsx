import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '../../components/ExternalLink'
import styles from './Markdown.module.css'
import { Plugin } from 'unified'
import { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import remarkDirective from 'remark-directive'
import { ItemLink } from '../../components/ItemLink'

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

// https://github.com/vercel/next.js/issues/25454#issuecomment-939321320
declare module 'react-markdown/react-markdown.min' {
  import ReactMarkdown, {
    Components,
    Options,
    uriTransformer,
  } from 'react-markdown'
  export const Components: Components
  export const Options: Options
  export const uriTransformer: uriTransformer
  export default ReactMarkdown
}

declare module 'cytoscape-cose-bilkent'
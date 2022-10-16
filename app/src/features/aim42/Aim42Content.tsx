import { Parser, ProcessNodeDefinitions } from 'html-to-react'
import React from 'react'
import { ExternalLink } from '../ui'
import './aim42.css'

const isValidNode = function () {
  return true
}

const preprocessingInstructions = [
  {
    shouldPreprocessNode: function (node: any) {
      return node.name === 'img' && node.attribs?.src?.startsWith('./')
    },
    preprocessNode: function (node: any) {
      const path = node.attribs.src.substring(1)
      node.attribs.src = '/aim42' + path
    }
  }
]

// Order matters. Instructions are processed in the order they're defined
const processNodeDefinitions = new ProcessNodeDefinitions(React)
const processingInstructions = [
  {
    // Custom <a> processing
    shouldProcessNode: function (node: any) {
      return node.name === 'a' && node.attribs?.href
    },
    processNode: function (node: any, children: any, index: number) {
      const { href } = node.attribs
      const url = href.startsWith('#')
        ? 'https://aim42.github.io/' + href
        : href
      return (
        <ExternalLink
          key={index}
          url={url}
          iconProps={{ style: { transform: 'translate(0, -3px)' } }}
        >
          {children}
        </ExternalLink>
      )
    }
  },
  {
    // Anything else
    shouldProcessNode: function (node: any) {
      return true
    },
    processNode: processNodeDefinitions.processDefaultNode
  }
]

const htmlToReactParser = new Parser()

export const Aim42Content: React.FC<{ html: string }> = props => {
  const reactElement = htmlToReactParser.parseWithInstructions(
    props.html,
    isValidNode,
    processingInstructions,
    preprocessingInstructions
  )

  return <div className="aim42-container">{reactElement}</div>
}

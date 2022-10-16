import { Input, Popover } from 'antd'
import { TextAreaProps } from 'antd/lib/input'
import React from 'react'
import { ExternalLink } from '../../components/ExternalLink'

export const MarkdownEditor: React.FC<TextAreaProps> = React.forwardRef(
  (props, ref) => {
    const { style, ...restProps } = props
    return (
      <>
        <Input.TextArea
          rows={6}
          style={{ borderBottomLeftRadius: 0, ...style }}
          ref={ref as any}
          {...restProps}
        />
        <Popover
          content={
            <>
              This field can be formatted with Markdown.
              <br />
              Available syntax:{' '}
              <ExternalLink url="https://docs.scope42.org/markdown">
                docs.scope42.org/markdown
              </ExternalLink>
            </>
          }
          title="Markdown"
        >
          <span
            style={{
              backgroundColor: '#d9d9d9',
              padding: '0 4px',
              marginTop: -1,
              display: 'inline-block',
              borderBottomRightRadius: 2,
              borderBottomLeftRadius: 2,
              color: '#b1b1b1',
              cursor: 'help'
            }}
          >
            Markdown
          </span>
        </Popover>
      </>
    )
  }
)

import {
  PageHeader as AntdPageHeader,
  PageHeaderProps as AntdPageHeaderProps
} from 'antd'

type PageHeaderProps = {
  children?: React.ReactNode
  title: string
  icon?: React.ReactNode
  backButton?: boolean
} & Pick<AntdPageHeaderProps, 'tags' | 'extra'>

export const PageHeader: React.FC<PageHeaderProps> = props => {
  const { children, title, icon, backButton, ...restProps } = props
  return (
    <AntdPageHeader
      style={{
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        marginBottom: 50
      }}
      onBack={backButton ? () => window.history.back() : undefined}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          {title}
        </div>
      }
      {...restProps}
    >
      {children}
    </AntdPageHeader>
  )
}

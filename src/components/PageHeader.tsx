import {PageHeader as AntdPageHeader} from 'antd'

interface PageHeaderProps {
  title: string,
  icon?: React.ReactNode,
  extra?: React.ReactNode,
  backButton?: boolean,
}

export const PageHeader: React.FC<PageHeaderProps> = props => {
  return <AntdPageHeader
    style={{border: "1px solid #ddd", backgroundColor: "#f9f9f9", marginBottom: 50}}
    onBack={props.backButton ? () => window.history.back() : undefined}
    title={<div style={{display: "flex", alignItems: "center", gap: 8}}>{props.icon}{props.title}</div>}
    extra={props.extra}
  >
    {props.children}
  </AntdPageHeader>
}
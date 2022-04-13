import { Input, Typography } from 'antd'
import { SearchProps } from 'antd/lib/input'

export const SearchInput: React.VFC<SearchProps> = props => {
  return (
    <Input.Search
      placeholder="Search"
      onSearch={() => {}}
      size="large"
      style={{ width: 300 }}
      enterButton
      suffix={
        <span style={{ fontSize: 14, cursor: 'pointer' }}>
          <Typography.Text style={{ marginRight: 0 }} keyboard>
            Ctrl
          </Typography.Text>
          <Typography.Text keyboard>K</Typography.Text>
        </span>
      }
      {...props}
    />
  )
}

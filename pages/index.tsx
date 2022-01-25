import { Button } from 'antd'

export default function Home(props: any) {
  return (
    <div>
      <pre>{props.workspace}</pre>
      <pre>{JSON.stringify(props.data)}</pre>
      <Button>Test</Button>
    </div>
  )
}

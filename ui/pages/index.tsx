import { Button } from 'antd'
import { loadIssues } from '../data'

export default function Home(props: any) {
  return (
    <div>
      <pre>{props.workspace}</pre>
      <pre>{JSON.stringify(props.data)}</pre>
      <Button>Test</Button>
    </div>
  )
}

export const getStaticProps = () => {
  return { props: { workspace: process.env.WORKSPACE ?? 'nix', data: loadIssues() } }
}

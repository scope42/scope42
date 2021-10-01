import { Button } from 'antd'
import fs from 'fs'

export default function Home(props: any) {
  return (
    <div>
      <pre>{props.workspace}</pre>
      <pre>{props.data}</pre>
      <Button>Test</Button>
    </div>
  )
}

export const getStaticProps = () => {
  return { props: { workspace: process.env.WORKSPACE ?? 'nix', data: fs.readFileSync('C:\\Projekte\\scope42-test\\data.txt', 'utf8') } }
}

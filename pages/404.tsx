import { Button, Result } from "antd"
import Link from "next/link"

export const Error404: React.FC = () => {
  return <Result
  status="404"
  title="404"
  subTitle="Sorry, the page you visited does not exist."
  extra={<Link href="/" ><a><Button type="primary">Back Home</Button></a></Link>}
/>
}

export default Error404
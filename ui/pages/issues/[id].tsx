/* eslint-disable unicorn/filename-case */
import { GetStaticPaths, GetStaticProps } from 'next'
import { Issue, loadIssue } from '../../data'
import ReactMarkdown from 'react-markdown/react-markdown.min'
import { PageHeader, Tag, Row, Descriptions, Badge } from 'antd'

const IssuePage = ({ issue }: { issue: Issue }) => {
  return <>
    <PageHeader
      onBack={() => window.history.back()}
      title={<><Badge color={'cyan'} />{issue.title}</>}
      subTitle="This is a subtitle"
    >
      <Row>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Status">
            <Tag color="green">Open</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="Tags">
            <Tag>Frontend</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Row>
    </PageHeader>
    <ReactMarkdown>{issue.body}</ReactMarkdown>
  </>
}

export default IssuePage

export const getStaticProps: GetStaticProps = async context => {
  return { props: { issue: loadIssue(`${context.params?.id}`) } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [{ params: { id: '2021-09-10-test-issue' } }], fallback: false }
}

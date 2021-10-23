/* eslint-disable unicorn/filename-case */
import { GetStaticPaths, GetStaticProps } from 'next'
import { Issue, loadIssue } from '../../data'
import ReactMarkdown from 'react-markdown/react-markdown.min'

const IssuePage = ({ issue }: { issue: Issue }) => {
  return <><p>Issue: {issue.title}</p>
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

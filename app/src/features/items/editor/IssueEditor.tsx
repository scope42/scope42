import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { IssueIcon } from '../../../components/ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IssueId, IssueStatus, NewIssue } from '../../../data/types'
import { ISSUE_STATUS_UI } from '../../../components/Status'
import { selectAllIssues, selectAllTags, useStore } from '../../../data/store'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { getDefaults } from '../../../data/util'
import { MarkdownEditor } from '../../markdown'

export const IssueEditor: React.FC<{ issueId?: IssueId }> = props => {
  const allTags = useStore(selectAllTags)
  const allIssues = useStore(selectAllIssues)
  const createItem = useStore(state => state.createItem)
  const updateItem = useStore(state => state.updateItem)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.issueId
      ? allIssues.find(i => i.id === props.issueId)
      : (getDefaults(NewIssue) as NewIssue),
    resolver: zodResolver(NewIssue)
  })

  const onSuccess = async (issue: NewIssue) => {
    if (props.issueId) {
      await updateItem({ ...issue, id: props.issueId })
      message.success('Issue updated')
    } else {
      const newId = await createItem(issue)
      message.success('Issue created')
      navigate('/issues/' + newId)
    }
    closeEditor()
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IssueIcon />
          <span>{props.issueId ? 'Edit' : 'Create'} Issue</span>
        </div>
      }
      maskClosable={false}
      visible={true}
      onOk={handleSubmit(onSuccess)}
      onCancel={closeEditor}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
        <Form.Item
          required
          label="Title"
          validateStatus={errors.title?.message ? 'error' : undefined}
          help={errors.title?.message}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          required
          label="Status"
          validateStatus={errors.status?.message ? 'error' : undefined}
          help={errors.status?.message}
        >
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select {...field}>
                {IssueStatus.options.map(status => (
                  <Select.Option value={status} key={status}>
                    {ISSUE_STATUS_UI[status].label}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Tags"
          validateStatus={errors.tags ? 'error' : undefined}
          help={errors.tags?.map(e => e.message).join(', ')}
        >
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Select {...field} mode="tags">
                {allTags.map(tag => (
                  <Select.Option key={tag} value={tag}>
                    {tag}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Caused by"
          validateStatus={errors.causedBy ? 'error' : undefined}
          help={errors.causedBy?.map(e => e.message).join(', ')}
        >
          <Controller
            control={control}
            name="causedBy"
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                optionFilterProp="children"
                mode="multiple"
              >
                {allIssues.map(issue => (
                  <Select.Option key={issue.id} value={issue.id}>
                    <Tag>{issue.id}</Tag> {issue.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Ticket URL"
          validateStatus={errors.ticket?.message ? 'error' : undefined}
          help={errors.ticket?.message}
        >
          <Controller
            control={control}
            name="ticket"
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          validateStatus={errors.description?.message ? 'error' : undefined}
          help={errors.description?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => <MarkdownEditor {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

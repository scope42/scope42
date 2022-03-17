import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { IssueIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Issue, IssueId, IssueStatus } from '../../data/types'
import { ISSUE_STATUS_UI } from '../Status'
import { selectAllTags, useStore } from '../../data/store'
import TextArea from 'antd/lib/input/TextArea'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'

export const IssueEditor: React.FC<{ issueId?: IssueId }> = props => {
  const allTags = useStore(selectAllTags)
  const allIssues = useStore(state => state.issues)
  const updateIssue = useStore(state => state.updateIssue)
  const createIssue = useStore(state => state.createIssue)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.issueId
      ? allIssues[props.issueId]
      : { ...Issue.parse({ title: 'dummy' }), title: '' },
    resolver: zodResolver(Issue)
  })

  const onSuccess = async (newIssue: Issue) => {
    if (props.issueId) {
      await updateIssue(props.issueId, newIssue)
      message.success('Issue updated')
    } else {
      const newId = await createIssue(newIssue)
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
                {Object.keys(allIssues).map(id => (
                  <Select.Option key={id} value={id}>
                    <Tag>{id}</Tag> {allIssues[id].title}
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
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

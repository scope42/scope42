import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { RiskIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  NewRisk,
  NewRiskSchema,
  RiskId,
  RiskStatuses,
  statusLabel
} from '@scope42/data'
import {
  selectAllIssues,
  selectAllRisks,
  selectAllTags,
  useStore
} from '../../../data/store'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { MarkdownEditor } from '../../../features/markdown'
import { getErrorMessage } from './form-utils'
import { getDefaults } from '../../../data/util'

export const RiskEditor: React.FC<{ riskId?: RiskId }> = props => {
  const allTags = useStore(selectAllTags)
  const allRisks = useStore(selectAllRisks)
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
    defaultValues: props.riskId
      ? allRisks.find(r => r.id === props.riskId)
      : ({ ...getDefaults(NewRiskSchema), status: 'current' } as NewRisk),
    resolver: zodResolver(NewRiskSchema)
  })

  const onSuccess = async (risk: NewRisk) => {
    if (props.riskId) {
      await updateItem({ ...risk, id: props.riskId })
      message.success('Risk updated')
    } else {
      const newId = await createItem(risk)
      message.success('Risk created')
      navigate('/risks/' + newId)
    }
    closeEditor()
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RiskIcon />
          <span>{props.riskId ? 'Edit' : 'Create'} Risk</span>
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
                {RiskStatuses.map(status => (
                  <Select.Option value={status} key={status}>
                    {statusLabel(status)}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Tags"
          validateStatus={errors.tags ? 'error' : undefined}
          help={getErrorMessage(errors.tags)}
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
          help={getErrorMessage(errors.causedBy)}
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

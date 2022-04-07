import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { DecisionIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DecisionId, DecisionStatus, NewDecision } from '../../data/types'
import { DECISION_STATUS_UI } from '../Status'
import { selectAllDecisions, selectAllTags, useStore } from '../../data/store'
import TextArea from 'antd/lib/input/TextArea'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { getDefaults } from '../../data/util'

export const DecisionEditor: React.FC<{ decisionId?: DecisionId }> = props => {
  const allTags = useStore(selectAllTags)
  const allDecisions = useStore(selectAllDecisions)
  const createItem = useStore(state => state.createItem)
  const updateItem = useStore(state => state.updateItem)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.decisionId
      ? allDecisions.find(i => i.id === props.decisionId)
      : (getDefaults(NewDecision) as NewDecision),
    resolver: zodResolver(NewDecision)
  })

  const onSuccess = async (decision: NewDecision) => {
    if (props.decisionId) {
      await updateItem({ ...decision, id: props.decisionId })
      message.success('Decision updated')
    } else {
      const newId = await createItem(decision)
      message.success('Decision created')
      navigate('/decisions/' + newId)
    }
    closeEditor()
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DecisionIcon />
          <span>{props.decisionId ? 'Edit' : 'Create'} Decision</span>
        </div>
      }
      visible={true}
      onOk={handleSubmit(onSuccess)}
      onCancel={closeEditor}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off">
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
                {DecisionStatus.options.map(status => (
                  <Select.Option value={status} key={status}>
                    {DECISION_STATUS_UI[status].label}
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
          label="Superseded by"
          validateStatus={errors.supersededBy?.message ? 'error' : undefined}
          help={errors.supersededBy?.message}
        >
          <Controller
            control={control}
            name="supersededBy"
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {allDecisions.map(decision => (
                  <Select.Option key={decision.id} value={decision.id}>
                    <Tag>{decision.id}</Tag> {decision.title}
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

import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { RiskIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IssueId, Risk, RiskStatus } from '../../data/types'
import { RISK_STATUS_UI } from '../Status'
import { selectAllTags, useStore } from '../../data/store'
import TextArea from 'antd/lib/input/TextArea'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'

export const RiskEditor: React.FC<{ riskId?: IssueId }> = props => {
  const allTags = useStore(selectAllTags)
  const allRisks = useStore(state => state.risks)
  const allIssues = useStore(state => state.issues)
  const updateRisk = useStore(state => state.updateRisk)
  const createRisk = useStore(state => state.createRisk)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.riskId
      ? allRisks[props.riskId]
      : { ...Risk.parse({ title: 'dummy' }), title: '' },
    resolver: zodResolver(Risk)
  })

  const onSuccess = async (newRisk: Risk) => {
    if (props.riskId) {
      await updateRisk(props.riskId, newRisk)
      message.success('Risk updated')
    } else {
      const newId = await createRisk(newRisk)
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
                {RiskStatus.options.map(status => (
                  <Select.Option value={status} key={status}>
                    {RISK_STATUS_UI[status].label}
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
          label="Body"
          validateStatus={errors.body?.message ? 'error' : undefined}
          help={errors.body?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="body"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

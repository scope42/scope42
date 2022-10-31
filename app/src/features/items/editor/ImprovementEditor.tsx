import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { ImprovementIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImprovementId, ImprovementStatus, NewImprovement } from '@scope42/data'
import { IMPROVEMENT_STATUS_UI } from '../Status'
import {
  selectAllImprovements,
  selectAllIssues,
  selectAllRisks,
  selectAllTags,
  useStore
} from '../../../data/store'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from './form-utils'
import { getDefaults } from '../../../data/util'
import { MarkdownEditor } from '../../markdown'

export const ImprovementEditor: React.FC<{
  improvementId?: ImprovementId
}> = props => {
  const allTags = useStore(selectAllTags)
  const allIssues = useStore(selectAllIssues)
  const allRisks = useStore(selectAllRisks)
  const allImprovements = useStore(selectAllImprovements)
  const createItem = useStore(state => state.createItem)
  const updateItem = useStore(state => state.updateItem)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)
  const allIssuesAndRisks = [...allIssues, ...allRisks]

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.improvementId
      ? allImprovements.find(i => i.id === props.improvementId)
      : (getDefaults(NewImprovement) as NewImprovement),
    resolver: zodResolver(NewImprovement)
  })

  const onSuccess = async (improvement: NewImprovement) => {
    if (props.improvementId) {
      await updateItem({ ...improvement, id: props.improvementId })
      message.success('Improvement updated')
    } else {
      const newId = await createItem(improvement)
      message.success('Improvement created')
      navigate('/improvements/' + newId)
    }
    closeEditor()
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImprovementIcon />
          <span>{props.improvementId ? 'Edit' : 'Create'} Improvement</span>
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
                {ImprovementStatus.options.map(status => (
                  <Select.Option value={status} key={status}>
                    {IMPROVEMENT_STATUS_UI[status].label}
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
          label="Resolves"
          required
          validateStatus={errors.resolves ? 'error' : undefined}
          help={getErrorMessage(errors.resolves)}
        >
          <Controller
            control={control}
            name="resolves"
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                optionFilterProp="children"
                mode="multiple"
              >
                {allIssuesAndRisks.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    <Tag>{item.id}</Tag> {item.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Modifies"
          validateStatus={errors.modifies ? 'error' : undefined}
          help={getErrorMessage(errors.modifies)}
        >
          <Controller
            control={control}
            name="modifies"
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                optionFilterProp="children"
                mode="multiple"
              >
                {allRisks.map(risk => (
                  <Select.Option key={risk.id} value={risk.id}>
                    <Tag>{risk.id}</Tag> {risk.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Creates"
          validateStatus={errors.creates ? 'error' : undefined}
          help={getErrorMessage(errors.creates)}
        >
          <Controller
            control={control}
            name="creates"
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                optionFilterProp="children"
                mode="multiple"
              >
                {allRisks.map(risk => (
                  <Select.Option key={risk.id} value={risk.id}>
                    <Tag>{risk.id}</Tag> {risk.title}
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

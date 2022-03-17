import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { ImprovementIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Improvement, ImprovementId, ImprovementStatus } from '../../data/types'
import { IMPROVEMENT_STATUS_UI } from '../Status'
import { selectAllTags, useStore } from '../../data/store'
import TextArea from 'antd/lib/input/TextArea'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from './form-utils'

export const ImprovementEditor: React.FC<{
  improvementId?: ImprovementId
}> = props => {
  const allTags = useStore(selectAllTags)
  const allIssues = useStore(state => state.issues)
  const allRisks = useStore(state => state.risks)
  const allImprovements = useStore(state => state.improvements)
  const updateImprovement = useStore(state => state.updateImprovement)
  const createImprovement = useStore(state => state.createImprovement)
  const navigate = useNavigate()
  const closeEditor = useEditorStore(state => state.closeEditor)
  const allIssuesAndRisks = { ...allIssues, ...allRisks }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: props.improvementId
      ? allImprovements[props.improvementId]
      : { ...Improvement.parse({ title: 'dummy' }), title: '' },
    resolver: zodResolver(Improvement)
  })

  const onSuccess = async (newImprovement: Improvement) => {
    if (props.improvementId) {
      await updateImprovement(props.improvementId, newImprovement)
      message.success('Improvement updated')
    } else {
      const newId = await createImprovement(newImprovement)
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
                {Object.keys(allIssuesAndRisks).map(id => (
                  <Select.Option key={id} value={id}>
                    <Tag>{id}</Tag> {allIssuesAndRisks[id].title}
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
                {Object.keys(allRisks).map(id => (
                  <Select.Option key={id} value={id}>
                    <Tag>{id}</Tag> {allRisks[id].title}
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
                {Object.keys(allRisks).map(id => (
                  <Select.Option key={id} value={id}>
                    <Tag>{id}</Tag> {allRisks[id].title}
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

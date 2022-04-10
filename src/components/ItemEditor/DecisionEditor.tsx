import { Form, Input, message, Modal, Select, Tag } from 'antd'
import { DecisionIcon } from '../ItemIcon'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DecisionId, DecisionStatus, NewDecision } from '../../data/types'
import { DECISION_STATUS_UI } from '../Status'
import {
  selectAllDecisions,
  selectAllPersonNames,
  selectAllTags,
  useStore
} from '../../data/store'
import TextArea from 'antd/lib/input/TextArea'
import { useEditorStore } from './ItemEditor'
import { useNavigate } from 'react-router-dom'
import { getDefaults } from '../../data/util'
import React from 'react'
import { NativeDatePicker } from '../../features/forms'
import { InfoBubble } from '../../features/ui'

/**
 * Source: https://github.com/adr/madr/blob/main/template/adr-template.md (CC0)
 */
const help = {
  context:
    'Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.',
  drivers: 'For example forces, facing concerns, etc.'
}

export const DecisionEditor: React.FC<{ decisionId?: DecisionId }> = props => {
  const allTags = useStore(selectAllTags)
  const allPersonNames = useStore(selectAllPersonNames)
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
      width={600}
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
          label="Deciders"
          validateStatus={errors.deciders ? 'error' : undefined}
          help={errors.deciders?.map(e => e.message).join(', ')}
        >
          <Controller
            control={control}
            name="deciders"
            render={({ field }) => (
              <Select {...field} mode="tags">
                {allPersonNames.map(tag => (
                  <Select.Option key={tag} value={tag}>
                    {tag}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Decided"
          validateStatus={errors.decided?.message ? 'error' : undefined}
          help={errors.decided?.message}
        >
          <Controller
            control={control}
            name="decided"
            render={({ field }) => <NativeDatePicker {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Context&nbsp;<InfoBubble>{help.context}</InfoBubble>
            </>
          }
          required
          validateStatus={errors.context?.message ? 'error' : undefined}
          help={errors.context?.message}
        >
          <Controller
            control={control}
            name="context"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Decision Drivers&nbsp;<InfoBubble>{help.drivers}</InfoBubble>
            </>
          }
          validateStatus={errors.drivers?.message ? 'error' : undefined}
          help={errors.drivers?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="drivers"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

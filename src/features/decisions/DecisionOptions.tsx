import { Decision, DecisionOption } from '../../data/types'
import {
  Form,
  message,
  Modal,
  Button,
  Input,
  Row,
  Col,
  Typography,
  Avatar as AntdAvatar,
  Divider
} from 'antd'
import { getDefaults } from '../../data/util'
import { useStore } from '../../data/store'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextArea from 'antd/lib/input/TextArea'
import produce from 'immer'
import { useState } from 'react'
import {
  DislikeOutlined,
  LikeOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import { RenderedMarkdown } from '../markdown'
import { red, green, blue } from '@ant-design/colors'
import { AvatarDiv } from '../ui'

export const DecisionOptions: React.VFC<{ decision: Decision }> = ({
  decision
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  return (
    <>
      {decision.options.map((option, index) => (
        <div key={option.title}>
          <Row gutter={16}>
            <Col span={8}>
              <AvatarDiv
                avatar={
                  <AntdAvatar style={{ backgroundColor: blue.primary }}>
                    <b>{`${index + 1}`}</b>
                  </AntdAvatar>
                }
              >
                <Typography.Title level={4}>{option.title}</Typography.Title>
                {option.description && (
                  <RenderedMarkdown>{option.description}</RenderedMarkdown>
                )}
                <Typography.Text
                  type="secondary"
                  onClick={() => setEditingIndex(index)}
                  style={{ cursor: 'pointer' }}
                >
                  Edit
                </Typography.Text>
              </AvatarDiv>
            </Col>
            <Col span={8}>
              {option.pros && (
                <AvatarDiv
                  avatar={
                    <AntdAvatar
                      style={{ backgroundColor: green[3] }}
                      icon={<LikeOutlined />}
                    />
                  }
                  tooltip="Pros"
                >
                  <RenderedMarkdown>{option.pros}</RenderedMarkdown>
                </AvatarDiv>
              )}
            </Col>
            <Col span={8}>
              {option.cons && (
                <AvatarDiv
                  avatar={
                    <AntdAvatar
                      style={{ backgroundColor: red[3] }}
                      icon={<DislikeOutlined />}
                    />
                  }
                  tooltip="Cons"
                >
                  <RenderedMarkdown>{option.cons}</RenderedMarkdown>
                </AvatarDiv>
              )}
            </Col>
          </Row>
          <Divider />
        </div>
      ))}
      <p>
        <Button
          block
          icon={<PlusCircleOutlined />}
          onClick={() => setEditingIndex(-1)}
        >
          Add Option
        </Button>
      </p>
      {editingIndex === null ? null : (
        <OptionEditor
          decision={decision}
          commentIndex={editingIndex}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  )
}

const OptionEditor: React.VFC<{
  decision: Decision
  commentIndex: number
  onClose: () => void
}> = props => {
  const { decision, commentIndex, onClose } = props
  const updateItem = useStore(state => state.updateItem)

  const isCreation = commentIndex < 0

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: isCreation
      ? (getDefaults(DecisionOption) as DecisionOption)
      : decision.options[commentIndex],
    resolver: zodResolver(DecisionOption)
  })

  const onSuccess = async (option: DecisionOption) => {
    if (isCreation) {
      const updatedDecision = produce(decision, decision => {
        decision.options.push(option)
      })
      await updateItem(updatedDecision)
      message.success('Option created')
    } else {
      const updatedDecision = produce(decision, decision => {
        decision.options[commentIndex] = option
      })
      await updateItem(updatedDecision)
      message.success('Option updated')
    }
    onClose()
  }

  return (
    <Modal
      title={`${isCreation ? 'Create' : 'Edit'} Option`}
      visible={true}
      onOk={handleSubmit(onSuccess)}
      onCancel={onClose}
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
          label="Description"
          validateStatus={errors.description?.message ? 'error' : undefined}
          help={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Pros"
          validateStatus={errors.pros?.message ? 'error' : undefined}
          help={errors.pros?.message}
        >
          <Controller
            control={control}
            name="pros"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Cons"
          validateStatus={errors.cons?.message ? 'error' : undefined}
          help={errors.cons?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="cons"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
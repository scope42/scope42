import {
  CheckCircleOutlined,
  FrownOutlined,
  SmileOutlined
} from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Avatar as AntdAvatar,
  Typography,
  Row,
  Col
} from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '../../data/store'
import {
  Decision,
  DecisionOutcome as DecisionOutcomeSchema
} from '../../data/types'
import { getDefaults } from '../../data/util'
import produce from 'immer'
import { useState } from 'react'
import { red, green, blue } from '@ant-design/colors'
import { Markdown, MarkdownEditor } from '../markdown'
import { AvatarDiv, InfoBubble } from '../ui'

/**
 * Source: https://github.com/adr/madr/blob/main/template/adr-template.md (CC0)
 */
const help = {
  positiveConsequences:
    'For example improvement of quality attribute satisfaction, follow-up decisions required, etc.',
  negativeConsequences:
    'For example compromising quality attribute, follow-up decisions required, etc.'
}

export const DecisionOutcome: React.VFC<{ decision: Decision }> = ({
  decision
}) => {
  const [editing, setEditing] = useState(false)
  return (
    <>
      {decision.outcome ? (
        <>
          <Typography.Text type="success" strong>
            Chosen Option
          </Typography.Text>
          <div style={{ display: 'flex', gap: 8 }}>
            <AntdAvatar style={{ backgroundColor: blue.primary }}>
              <b>{`${decision.outcome.optionIndex + 1}`}</b>
            </AntdAvatar>
            <Typography.Title level={4}>
              {decision.options[decision.outcome.optionIndex].title}
            </Typography.Title>
          </div>
          {decision.outcome.rationale && (
            <Markdown>{decision.outcome.rationale}</Markdown>
          )}
          {(decision.outcome.positiveConsequences ||
            decision.outcome.negativeConsequences) && (
            <Row style={{ marginBottom: '1em' }} gutter={16}>
              <Col span={24}>
                <Typography.Title level={4}>Consequences</Typography.Title>
              </Col>
              {decision.outcome.positiveConsequences && (
                <Col span={12}>
                  <AvatarDiv
                    avatar={
                      <AntdAvatar
                        style={{ backgroundColor: green[3] }}
                        icon={<SmileOutlined />}
                      />
                    }
                    tooltip="Positive"
                  >
                    <Markdown>{decision.outcome.positiveConsequences}</Markdown>
                  </AvatarDiv>
                </Col>
              )}
              {decision.outcome.negativeConsequences && (
                <Col span={12}>
                  <AvatarDiv
                    avatar={
                      <AntdAvatar
                        style={{ backgroundColor: red[3] }}
                        icon={<FrownOutlined />}
                      />
                    }
                    tooltip="Negative"
                  >
                    <Markdown>{decision.outcome.negativeConsequences}</Markdown>
                  </AvatarDiv>
                </Col>
              )}
            </Row>
          )}
          <p>
            <Typography.Text
              type="secondary"
              onClick={() => setEditing(true)}
              style={{ cursor: 'pointer' }}
            >
              Edit
            </Typography.Text>
          </p>
        </>
      ) : (
        <p>
          <Button
            block
            onClick={() => setEditing(true)}
            icon={<CheckCircleOutlined />}
            disabled={decision.options.length === 0}
          >
            Set Outcome
          </Button>
        </p>
      )}
      {editing && (
        <OutcomeEditor decision={decision} onClose={() => setEditing(false)} />
      )}
    </>
  )
}

const OutcomeEditor: React.VFC<{
  decision: Decision
  onClose: () => void
}> = props => {
  const { decision, onClose } = props
  const updateItem = useStore(state => state.updateItem)

  const isCreation = !decision.outcome

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: isCreation
      ? (getDefaults(DecisionOutcomeSchema) as DecisionOutcomeSchema)
      : decision.outcome,
    resolver: zodResolver(DecisionOutcomeSchema)
  })

  const onSuccess = async (outcome: DecisionOutcomeSchema) => {
    const updatedDecision = produce(decision, decision => {
      decision.outcome = outcome
    })
    await updateItem(updatedDecision)
    message.success(`Outcome ${isCreation ? 'set' : 'updated'}`)
    onClose()
  }

  return (
    <Modal
      title={`${isCreation ? 'Create' : 'Edit'} Option`}
      visible={true}
      onOk={handleSubmit(onSuccess)}
      onCancel={onClose}
      width={800}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off">
        <Form.Item
          required
          label="Chosen Option"
          validateStatus={errors.optionIndex?.message ? 'error' : undefined}
          help={errors.optionIndex?.message}
        >
          <Controller
            control={control}
            name="optionIndex"
            render={({ field }) => (
              <Select {...field}>
                {decision.options.map((option, index) => (
                  <Select.Option key={index} value={index}>
                    {option.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Rationale"
          validateStatus={errors.rationale?.message ? 'error' : undefined}
          help={errors.rationale?.message}
        >
          <Controller
            control={control}
            name="rationale"
            render={({ field }) => <MarkdownEditor {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Positive Consequences&nbsp;
              <InfoBubble>{help.positiveConsequences}</InfoBubble>
            </>
          }
          validateStatus={
            errors.positiveConsequences?.message ? 'error' : undefined
          }
          help={errors.positiveConsequences?.message}
        >
          <Controller
            control={control}
            name="positiveConsequences"
            render={({ field }) => <MarkdownEditor {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Negative Consequences&nbsp;
              <InfoBubble>{help.negativeConsequences}</InfoBubble>
            </>
          }
          validateStatus={
            errors.negativeConsequences?.message ? 'error' : undefined
          }
          help={errors.negativeConsequences?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="negativeConsequences"
            render={({ field }) => <MarkdownEditor {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

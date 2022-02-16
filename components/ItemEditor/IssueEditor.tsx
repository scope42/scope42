import { Form, Input, message, Modal, Select, Tag } from "antd"
import { IssueIcon } from "../ItemIcon"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Issue, IssueId } from "../../data/types"
import { ISSUE_STATUS_UI } from "../Status"
import { selectAllTags, useStore } from "../../data/store"
import TextArea from "antd/lib/input/TextArea"
import { useRouter } from "next/router"
import { useEditorStore } from "./ItemEditor"

export const IssueEditor: React.FC<{issueId?: IssueId}> = (props) => {
  const allTags = useStore(selectAllTags)
  const allIssues = useStore(state => state.issues)
  const updateIssue = useStore(state => state.updateIssue)
  const createIssue = useStore(state => state.createIssue)
  const router = useRouter()
  const closeEditor = useEditorStore(state => state.closeEditor)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: props.issueId ? allIssues[props.issueId] : {...Issue.parse({title: "dummy"}), title: ""},
    resolver: zodResolver(Issue),
  })  

  const onSuccess = async (newIssue: Issue) => {
    if (props.issueId) {
      await updateIssue(props.issueId, newIssue)
      message.success("Issue updated")
    } else {
      const newId = await createIssue(newIssue)
      message.success("Issue created")
      router.push("/issues/" + newId)
    }
    closeEditor()
  }

  return <Modal title={<div style={{display: "flex", alignItems: "center", gap: 8}}><IssueIcon /><span>{props.issueId ? "Edit" : "Create"} Issue</span></div>} visible={true} onOk={handleSubmit(onSuccess)} onCancel={closeEditor}>
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      autoComplete="off"
    >
      <Form.Item required label="Title" validateStatus={errors.title?.message ? "error" : undefined} help={errors.title?.message}>
        <Controller control={control} name="title" render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item required label="Status" validateStatus={errors.status?.message ? "error" : undefined} help={errors.status?.message}>
        <Controller control={control} name="status" render={({ field }) => <Select {...field}>
          <Select.Option value="current">{ISSUE_STATUS_UI["current"].label}</Select.Option>
          <Select.Option value="potential">{ISSUE_STATUS_UI["potential"].label}</Select.Option>
          <Select.Option value="resolved">{ISSUE_STATUS_UI["resolved"].label}</Select.Option>
          <Select.Option value="discarded">{ISSUE_STATUS_UI["discarded"].label}</Select.Option>
        </Select>} />
      </Form.Item>

      <Form.Item label="Tags" validateStatus={errors.tags ? "error" : undefined} help={errors.tags?.map(e => e.message).join(", ")}>
        <Controller control={control} name="tags" render={({ field }) => <Select {...field} mode="tags">
          {allTags.map(tag => <Select.Option key={tag} value={tag}>{tag}</Select.Option>)}
        </Select>} />
      </Form.Item>

      <Form.Item label="Cause" validateStatus={errors.cause?.message ? "error" : undefined} help={errors.cause?.message}>
        <Controller control={control} name="cause" render={({ field }) => <Select {...field} allowClear showSearch optionFilterProp="children">
          {Object.keys(allIssues).map(id => <Select.Option key={id} value={id}><Tag>{id}</Tag> {allIssues[id].title}</Select.Option>)}
        </Select>} />
      </Form.Item>

      <Form.Item label="Body" validateStatus={errors.body?.message ? "error" : undefined} help={errors.body?.message} style={{ marginBottom: 0 }}>
        <Controller control={control} name="body" render={({ field }) => <TextArea rows={6} {...field} />} />
      </Form.Item>
    </Form>
  </Modal>
}
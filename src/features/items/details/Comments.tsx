import { Item, Comment } from '../../../data/types'
import {
  Comment as AntdComment,
  Form,
  message,
  Modal,
  Button,
  AutoComplete
} from 'antd'
import ReactMarkdown from 'react-markdown'
import { getDefaults, renderDateTime } from '../../../data/util'
import { selectAllPersonNames, useStore } from '../../../data/store'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextArea from 'antd/lib/input/TextArea'
import produce from 'immer'
import { useState } from 'react'
import { CommentOutlined } from '@ant-design/icons'
import { Avatar } from '../../people'

export const Comments: React.VFC<{ item: Item }> = props => {
  const comments = [...props.item.comments].reverse()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  return (
    <>
      <p>
        <Button
          block
          icon={<CommentOutlined />}
          onClick={() => setEditingIndex(-1)}
        >
          Add Comment
        </Button>
      </p>
      {comments.map((comment, index) => (
        <AntdComment
          key={index}
          author={comment.author}
          actions={[<span onClick={() => setEditingIndex(index)}>Edit</span>]}
          avatar={<Avatar name={comment.author} />}
          content={<ReactMarkdown>{comment.content}</ReactMarkdown>}
          datetime={renderDateTime(comment.created)}
        />
      ))}
      {editingIndex === null ? null : (
        <CommentEditor
          item={props.item}
          commentIndex={editingIndex}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  )
}

const CommentEditor: React.VFC<{
  item: Item
  commentIndex: number
  onClose: () => void
}> = props => {
  const { item, commentIndex, onClose } = props
  const updateItem = useStore(state => state.updateItem)
  const allPersonNames = useStore(state =>
    selectAllPersonNames(state).map(value => ({ value }))
  )

  const isCreation = commentIndex < 0

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: isCreation
      ? (getDefaults(Comment) as Comment)
      : item.comments[commentIndex],
    resolver: zodResolver(Comment)
  })

  const onSuccess = async (comment: Comment) => {
    if (isCreation) {
      const updatedItem = produce(item, item => {
        item.comments.push(comment)
      })
      await updateItem(updatedItem)
      message.success('Comment created')
    } else {
      const updatedItem = produce(item, item => {
        item.comments[commentIndex] = comment
      })
      await updateItem(updatedItem)
      message.success('Issue updated')
    }
    onClose()
  }

  return (
    <Modal
      title={`${isCreation ? 'Create' : 'Edit'} Comment`}
      visible={true}
      onOk={handleSubmit(onSuccess)}
      onCancel={onClose}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off">
        <Form.Item
          required
          label={isCreation ? 'Your name' : 'Author'}
          validateStatus={errors.author?.message ? 'error' : undefined}
          help={errors.author?.message}
        >
          <Controller
            control={control}
            name="author"
            render={({ field }) => (
              <AutoComplete
                options={allPersonNames}
                filterOption={(inputValue, option) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Comment"
          required
          validateStatus={errors.content?.message ? 'error' : undefined}
          help={errors.content?.message}
          style={{ marginBottom: 0 }}
        >
          <Controller
            control={control}
            name="content"
            render={({ field }) => <TextArea rows={6} {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

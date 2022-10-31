import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Divider, Modal, Typography } from 'antd'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import { ItemIcon } from '../items'
import { useStore } from '../../data/store'
import { ItemId } from '@scope42/data'
import { useNavigateToItem } from '../items'
import style from './HeaderSearch.module.css'
import { suggest } from './search-index'

export const HeaderSearch: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  useHotkeys('ctrl+k', e => {
    e.preventDefault()
    setModalVisible(true)
  })
  return (
    <>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        size="large"
        onClick={() => setModalVisible(true)}
        className={style.searchButton}
      >
        <Typography.Text style={{ marginRight: 0 }} keyboard>
          Ctrl
        </Typography.Text>
        <Typography.Text keyboard>K</Typography.Text>
      </Button>
      {modalVisible && <SearchModal onClose={() => setModalVisible(false)} />}
    </>
  )
}

const SearchModal: React.FC<{ onClose: () => void }> = props => {
  const [suggestions, setSuggestions] = useState<ItemId[]>([])
  const navigateToItem = useNavigateToItem()
  const navigate = useNavigate()

  const handleSearch = (value: string) => {
    suggest(value).then(setSuggestions)
  }

  const handleSelect = (itemId: ItemId) => {
    navigateToItem(itemId)
    props.onClose()
  }

  const handleEnter = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter') {
      navigate({
        pathname: '/search',
        search: new URLSearchParams({ q: event.currentTarget.value }).toString()
      })
      props.onClose()
    }
  }

  return (
    <Modal
      visible={true}
      onCancel={props.onClose}
      footer={
        <div style={{ textAlign: 'left' }}>
          <Typography.Text keyboard>⏎</Typography.Text> Search
          <Divider type="vertical" />
          <Typography.Text keyboard>Esc</Typography.Text> Close
        </div>
      }
      title={
        <>
          <SearchOutlined /> Search
        </>
      }
    >
      <AutoComplete
        style={{ width: '100%' }}
        onInputKeyDown={handleEnter}
        onSearch={handleSearch}
        autoFocus
        onSelect={handleSelect}
      >
        {suggestions.map(itemId => (
          <AutoComplete.Option key={itemId} value={itemId}>
            <ItemLabel id={itemId} />
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    </Modal>
  )
}

const ItemLabel: React.FC<{ id: ItemId }> = props => {
  const item = useStore(state => state.items[props.id])
  if (!item) {
    return <>{props.id}</>
  }
  return (
    <>
      <span style={{ position: 'relative', top: -2, marginRight: 8 }}>
        <ItemIcon type={item.type} size={16} />
      </span>
      {item.title}
    </>
  )
}

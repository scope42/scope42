import { PlusOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import Button from 'antd-button-color'
import { useEditorStore } from './ItemEditor/ItemEditor'
import { DecisionIcon, ImprovementIcon, IssueIcon, RiskIcon } from './ItemIcon'

export const AddItemButton: React.FC = () => {
  const editor = useEditorStore(
    ({ createIssue, createImprovement, createRisk, createDecision }) => ({
      createIssue,
      createImprovement,
      createRisk,
      createDecision
    })
  )

  const addMenu = (
    <Menu>
      <Menu.Item key="issue" icon={<IssueIcon />} onClick={editor.createIssue}>
        <span style={{ marginLeft: 8 }}>Issue</span>
      </Menu.Item>
      <Menu.Item
        key="improvement"
        icon={<ImprovementIcon />}
        onClick={editor.createImprovement}
      >
        <span style={{ marginLeft: 8 }}>Improvement</span>
      </Menu.Item>
      <Menu.Item key="risk" icon={<RiskIcon />} onClick={editor.createRisk}>
        <span style={{ marginLeft: 8 }}>Risk</span>
      </Menu.Item>
      <Menu.Item
        key="decision"
        icon={<DecisionIcon />}
        onClick={editor.createDecision}
      >
        <span style={{ marginLeft: 8 }}>Decision</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={addMenu} placement="bottomCenter" trigger={['click']}>
        <Button
          type="success"
          shape="circle"
          size="large"
          icon={<PlusOutlined />}
        />
      </Dropdown>
    </>
  )
}

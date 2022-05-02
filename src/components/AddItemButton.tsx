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
      <Menu.Item
        key="issue"
        icon={<IssueIcon style={{ fontSize: '20px' }} />}
        onClick={editor.createIssue}
      >
        Issue
      </Menu.Item>
      <Menu.Item
        key="improvement"
        icon={<ImprovementIcon style={{ fontSize: '20px' }} />}
        onClick={editor.createImprovement}
      >
        Improvement
      </Menu.Item>
      <Menu.Item
        key="risk"
        icon={<RiskIcon style={{ fontSize: '20px' }} />}
        onClick={editor.createRisk}
      >
        Risk
      </Menu.Item>
      <Menu.Item
        key="decision"
        icon={<DecisionIcon style={{ fontSize: '20px' }} />}
        onClick={editor.createDecision}
      >
        Decision
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

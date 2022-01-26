import { PlusOutlined } from "@ant-design/icons"
import { Dropdown, Menu, Modal } from "antd"
import Button from "antd-button-color"
import { useState } from "react"
import { EditIssue } from "./EditIssue"
import { ImprovementIcon, IssueIcon, RiskIcon } from "./ItemIcon"

export const AddIconButton: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"issue" | "improvement" | "risk" | null>(null)

  const addMenu = (
    <Menu>
      <Menu.Item key="issue" icon={<IssueIcon />} onClick={() => setActiveModal("issue")}>
        <span style={{marginLeft: 8}}>Issue</span>
      </Menu.Item>
      <Menu.Item key="improvement" icon={<ImprovementIcon />} onClick={() => setActiveModal("improvement")}>
        <span style={{marginLeft: 8}}>Improvement</span>
      </Menu.Item>
      <Menu.Item key="risk" icon={<RiskIcon />} onClick={() => setActiveModal("risk")}>
        <span style={{marginLeft: 8}}>Risk</span>
      </Menu.Item>
    </Menu>
  )

  return <>
    <Dropdown overlay={addMenu} placement="bottomCenter" trigger={['click']}>
      <Button type="success" shape="circle" size="large" icon={<PlusOutlined />} />
    </Dropdown>
    {activeModal === "issue" ? <EditIssue hide={() => setActiveModal(null)} /> : null}
  </>
}
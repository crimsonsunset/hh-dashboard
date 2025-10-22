import { Modal } from 'antd'

interface GenericModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Generic modal component showing roadmap/next steps
 * @param open - Controls modal visibility
 * @param onClose - Callback when modal is closed
 */
export function GenericModal({ open, onClose }: GenericModalProps) {
  return (
    <Modal
      title="Roadmap"
      open={open}
      onCancel={onClose}
      onOk={onClose}
      width={600}
    >
      <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
        <li>Wire up Date Selection on top bar</li>
        <li>Put proper styling primitives in place and ensure they are utilized across app</li>
        <li>Responsive styling</li>
        <li>Proper routing and query params (maybe /dashboard/start and /dashboard/loaded?selectedFilters=X)</li>
        <li>Testing framework</li>
        <li>Wire Up Graph Selector</li>
      </ul>
    </Modal>
  )
}


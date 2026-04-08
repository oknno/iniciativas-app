import { RoleWorkspacePage } from './RoleWorkspacePage'

export function StrategicControllerPage() {
  return (
    <RoleWorkspacePage
      title="Controladoria Estratégica"
      roleLabel="Controladoria Estratégica"
      pendingStatuses={['IN_REVIEW_STRATEGIC']}
      allowedStepIds={['review']}
      allowSaveInWizard={false}
      visibility={{
        new: false,
        edit: false,
        duplicate: false,
        delete: false,
        sendToApproval: true,
        backStatus: true,
      }}
      sendToApprovalLabel="Aprovar estratégica"
      backStatusLabel="Rejeitar estratégica"
      onSendToApproval={({ actions }) => {
        void actions.approveStrategic()
      }}
      onBackStatus={({ actions }) => {
        void actions.returnToOwnerFromStrategic()
      }}
    />
  )
}

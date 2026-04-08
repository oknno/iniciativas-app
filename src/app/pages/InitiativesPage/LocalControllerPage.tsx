import { RoleWorkspacePage } from './RoleWorkspacePage'

export function LocalControllerPage() {
  return (
    <RoleWorkspacePage
      title="Controladoria Local"
      roleLabel="Controladoria Local"
      pendingStatuses={['IN_REVIEW_LOCAL']}
      allowedStepIds={['components', 'values', 'review']}
      visibility={{
        new: false,
        edit: true,
        duplicate: false,
        delete: false,
        sendToApproval: true,
        backStatus: true,
      }}
      sendToApprovalLabel="Enviar p/ Estratégica"
      backStatusLabel="Devolver p/ Owner"
      onSendToApproval={({ selectedStatus, actions }) => {
        if (selectedStatus === 'IN_REVIEW_LOCAL') {
          void actions.sendToStrategicReview()
        }
      }}
      onBackStatus={({ actions }) => {
        void actions.returnToOwner()
      }}
    />
  )
}

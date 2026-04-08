import { RoleWorkspacePage } from './RoleWorkspacePage'

export function OwnerInitiativesPage() {
  return (
    <RoleWorkspacePage
      title="Owner Initiatives"
      roleLabel="Owner"
      pendingStatuses={['DRAFT_OWNER', 'RETURNED_TO_OWNER']}
      allowedStepIds={['initiative', 'components', 'values', 'review']}
      visibility={{
        new: true,
        edit: true,
        duplicate: true,
        delete: true,
        sendToApproval: true,
        backStatus: false,
      }}
      sendToApprovalLabel="Enviar p/ Local"
      onSendToApproval={({ actions }) => {
        void actions.sendToLocalReview()
      }}
      onBackStatus={() => {
        // Owner does not perform back status actions in this workspace.
      }}
    />
  )
}

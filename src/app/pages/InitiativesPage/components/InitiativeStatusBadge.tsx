import { Badge } from '../../../components/ui/Badge'
import type { InitiativeStatus } from '../../../../domain/initiatives/entities/InitiativeStatus'

type InitiativeStatusBadgeProps = {
  status: InitiativeStatus
}

const statusLabel: Record<InitiativeStatus, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone =
    status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : status === 'IN_REVIEW' ? 'warning' : 'info'

  return <Badge tone={tone}>{statusLabel[status]}</Badge>
}

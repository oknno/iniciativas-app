import { Badge } from '../../../components/ui/Badge'

type InitiativeStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected'

type InitiativeStatusBadgeProps = {
  status: InitiativeStatus
}

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone =
    status === 'Approved'
      ? 'success'
      : status === 'Rejected'
        ? 'danger'
        : status === 'In Review'
          ? 'warning'
          : 'info'

  return <Badge tone={tone}>{status}</Badge>
}

import { Badge } from '../../../components/ui/Badge'

type InitiativeStatusBadgeProps = {
  status: string
}

const toLabel = (status: string): string =>
  status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase())

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone =
    status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : status === 'IN_REVIEW' ? 'warning' : 'info'

  return <Badge tone={tone}>{toLabel(status)}</Badge>
}

import { Badge } from '../../../components/ui/Badge'

type InitiativeStatusBadgeProps = {
  status: string
}

const statusLabelMap: Record<string, string> = {
  DRAFT: 'Ativa',
  IN_REVIEW: 'Em Aprovação',
  APPROVED: 'Aprovada',
  REJECTED: 'Reprovado',
}

const toLabel = (status: string): string => statusLabelMap[status] ?? status

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone = status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : status === 'IN_REVIEW' ? 'warning' : 'neutral'

  return <Badge tone={tone}>{toLabel(status)}</Badge>
}

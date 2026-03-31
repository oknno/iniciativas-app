import { Badge } from '../../../components/ui/Badge'

type InitiativeStatusBadgeProps = {
  status: string
}

const statusLabelMap: Record<string, string> = {
  DRAFT: 'Rascunho',
  IN_REVIEW: 'Em Aprovação',
  APPROVED: 'Aprovado',
  REJECTED: 'Reprovado',
}

const toLabel = (status: string): string => statusLabelMap[status] ?? status

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone =
    status === 'DRAFT'
      ? 'neutral'
      : status === 'IN_REVIEW'
        ? 'info'
        : status === 'APPROVED'
          ? 'success'
          : status === 'REJECTED'
            ? 'danger'
            : 'warning'

  return <Badge tone={tone}>{toLabel(status)}</Badge>
}

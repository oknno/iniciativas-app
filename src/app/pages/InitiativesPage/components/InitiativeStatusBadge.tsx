import { Badge } from '../../../components/ui/Badge'
import { toInitiativeStatusLabelPtBr } from '../../../../domain/initiatives/entities/InitiativeStatus'

type InitiativeStatusBadgeProps = {
  status: string
}

export function InitiativeStatusBadge({ status }: InitiativeStatusBadgeProps) {
  const tone =
    status === 'DRAFT_OWNER'
      ? 'neutral'
      : status === 'IN_REVIEW_LOCAL' || status === 'IN_REVIEW_STRATEGIC'
        ? 'info'
        : status === 'LOCAL_APPROVED' || status === 'STRATEGIC_APPROVED'
          ? 'success'
          : status === 'STRATEGIC_REJECTED'
            ? 'danger'
            : 'warning'

  return <Badge tone={tone}>{toInitiativeStatusLabelPtBr(status)}</Badge>
}

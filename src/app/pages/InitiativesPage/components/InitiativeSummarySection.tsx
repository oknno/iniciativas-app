import { Field } from '../../../components/ui/Field'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativeSummarySectionProps = {
  selectedId: string | null
  selectedFull: InitiativeDetailDto | undefined
  selectedFullState: 'idle' | 'loading' | 'error' | 'loaded'
}

const sectionDivider = {
  borderTop: `1px solid ${uiTokens.colors.border}`,
  paddingTop: 10,
}

const styles = {
  root: {
    height: '100%',
    minHeight: 0,
    overflow: 'auto',
  },
  content: {
    display: 'grid',
    gap: uiTokens.spacing.md,
  },
  summaryHeader: {
    marginBottom: 10,
  },
  summaryTitle: {
    margin: 0,
    ...uiTokens.typography.subtitle,
    fontWeight: 700,
    color: uiTokens.colors.textPrimary,
  },
  summaryContent: {
    display: 'grid',
    gap: uiTokens.spacing.md,
  },
  summaryTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: uiTokens.spacing.sm,
  },
  initiativeTitle: {
    margin: 0,
    ...uiTokens.typography.body,
    fontWeight: 700,
    color: uiTokens.colors.textPrimary,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sapCodeText: {
    margin: 0,
    ...uiTokens.typography.caption,
    color: uiTokens.colors.textSecondary,
  },
  fieldGrid: {
    ...sectionDivider,
    display: 'grid',
    gap: 8,
  },
  longTextWrap: {
    ...sectionDivider,
    display: 'grid',
    gap: uiTokens.spacing.xs,
  },
  sectionTitle: {
    margin: 0,
    ...uiTokens.typography.caption,
    color: uiTokens.colors.textMuted,
  },
  longText: {
    margin: 0,
    ...uiTokens.typography.body,
    color: uiTokens.colors.textSecondary,
    whiteSpace: 'pre-wrap' as const,
  },
}

export function InitiativeSummarySection({ selectedId, selectedFull, selectedFullState }: InitiativeSummarySectionProps) {
  let content

  if (!selectedId || selectedFullState === 'idle') {
    content = <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  } else if (selectedFullState === 'loading') {
    content = <StateMessage title="Loading initiative" description="Please wait while initiative data is fetched." />
  } else if (selectedFullState === 'error') {
    content = <StateMessage title="Unable to load initiative" description="Try selecting the initiative again." />
  } else if (!selectedFull) {
    content = <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  } else {
    content = (
      <>
        <header style={styles.summaryHeader}>
          <h3 style={styles.summaryTitle}>Resumo</h3>
        </header>

        <div style={styles.summaryContent}>
          <div style={styles.summaryTitleRow}>
            <h4 style={styles.initiativeTitle} title={selectedFull.title}>
              {selectedFull.title}
            </h4>
            <InitiativeStatusBadge status={selectedFull.status} />
          </div>

          <p style={styles.sapCodeText}>codigoSAP: Pendente</p>

          <div style={styles.fieldGrid}>
            <Field layout="inline" label="Unidade" value={selectedFull.unidade || '-'} />
            <Field layout="inline" label="Responsável" value={selectedFull.responsavel || '-'} />
            <Field layout="inline" label="Stage" value={selectedFull.stage || '-'} />
            <Field layout="inline" label="Status" value={selectedFull.status || '-'} />
            <Field layout="inline" label="ID" value={selectedFull.id || '-'} />
            <Field layout="inline" label="Ganho anual" value={selectedFull.annualGain ?? '-'} />
          </div>

          <div style={styles.longTextWrap}>
            <p style={styles.sectionTitle}>Business Need</p>
            <p style={styles.longText}>-</p>
          </div>

          <div style={styles.longTextWrap}>
            <p style={styles.sectionTitle}>Proposed Solution</p>
            <p style={styles.longText}>-</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div style={styles.root}>
      <div style={styles.content}>
        {content}
      </div>
    </div>
  )
}

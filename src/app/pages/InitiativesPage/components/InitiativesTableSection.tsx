import type { CSSProperties } from 'react'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import type { InitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

type InitiativesTableSectionProps = {
  items: readonly InitiativeListItemDto[]
  selectedId?: InitiativeId
  onSelect: (id: InitiativeId) => void
  isLoading?: boolean
  errorMessage?: string
}

const columnTemplate = '90px 1fr 220px 160px'

const styles: Record<string, CSSProperties> = {
  container: {
    border: `1px solid ${uiTokens.colors.borderStrong}`,
    borderRadius: uiTokens.radius.md,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: uiTokens.colors.surface,
  },
  tableWrap: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  headerRow: {
    display: 'grid',
    gridTemplateColumns: columnTemplate,
    background: uiTokens.colors.surfaceMuted,
    borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
  },
  headerCell: {
    padding: '10px 10px',
    fontSize: 12,
    fontWeight: 700,
    color: uiTokens.colors.textSecondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: columnTemplate,
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${uiTokens.colors.border}`,
    cursor: 'pointer',
    background: uiTokens.colors.surface,
    textAlign: 'left',
  },
  cell: {
    padding: '10px 10px',
    fontSize: 13,
    color: uiTokens.colors.textPrimary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stateRow: {
    borderBottom: `1px solid ${uiTokens.colors.border}`,
    padding: uiTokens.spacing.sm,
  },
}

export function InitiativesTableSection({ items, selectedId, onSelect, isLoading = false, errorMessage }: InitiativesTableSectionProps) {
  const isEmpty = !isLoading && !errorMessage && items.length === 0

  return (
    <div style={styles.container}>
      <div style={styles.tableWrap}>
        <div style={styles.headerRow}>
          <span style={styles.headerCell}>ID</span>
          <span style={styles.headerCell}>Title</span>
          <span style={styles.headerCell}>Unidade</span>
          <span style={styles.headerCell}>Status</span>
        </div>

        <div style={styles.body}>
          {isLoading ? (
            <div style={styles.stateRow}>
              <StateMessage title="Loading initiatives" description="Please wait while initiative data is fetched." />
            </div>
          ) : null}

          {!isLoading && errorMessage ? (
            <div style={styles.stateRow}>
              <StateMessage title="Unable to load initiatives" description={errorMessage} />
            </div>
          ) : null}

          {isEmpty ? (
            <div style={styles.stateRow}>
              <StateMessage title="No initiatives available" description="Use New Initiative to create your first CAPEX initiative." />
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? items.map((item) => {
                const isSelected = item.id === selectedId

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    style={{ ...styles.row, background: isSelected ? uiTokens.colors.accentSoft : uiTokens.colors.surface }}
                  >
                    <span style={styles.cell}>{item.id}</span>
                    <span style={styles.cell}>{item.title}</span>
                    <span style={styles.cell}>{item.unidade || '-'}</span>
                    <span style={styles.cell}>{item.status || '-'}</span>
                  </button>
                )
              })
            : null}
        </div>
      </div>
    </div>
  )
}

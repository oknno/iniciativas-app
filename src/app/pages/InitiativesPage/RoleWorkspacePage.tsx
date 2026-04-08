import { CommandBar } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import { InitiativeWizardModal } from './InitiativeWizardModal'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'
import { InitiativesTableSection } from './components/InitiativesTableSection'
import { StagePendingPanel } from './components/StagePendingPanel'
import { useInitiativesPage } from './hooks/useInitiativesPage'
import type { WizardStepId } from './wizard/wizardOptions'

type RoleWorkspacePageProps = {
  title: string
  roleLabel: string
  pendingStatuses?: readonly string[]
  allowedStepIds: readonly WizardStepId[]
  allowSaveInWizard?: boolean
  visibility: {
    new: boolean
    edit: boolean
    duplicate: boolean
    delete: boolean
    sendToApproval: boolean
    backStatus: boolean
  }
  sendToApprovalLabel?: string
  backStatusLabel?: string
  onSendToApproval: (context: { selectedStatus: string; actions: ReturnType<typeof useInitiativesPage>['actions'] }) => void
  onBackStatus: (context: { selectedStatus: string; actions: ReturnType<typeof useInitiativesPage>['actions'] }) => void
}

export function RoleWorkspacePage({
  title,
  roleLabel,
  pendingStatuses,
  allowedStepIds,
  allowSaveInWizard = true,
  visibility,
  sendToApprovalLabel,
  backStatusLabel,
  onSendToApproval,
  onBackStatus,
}: RoleWorkspacePageProps) {
  const {
    items,
    rawItems,
    filters,
    totalCount,
    nextPageToken,
    paginationState,
    paginationErrorMessage,
    selectedId,
    selectedStatus,
    selectedItemDetail,
    selectedItemDetailState,
    isWizardOpen,
    wizardMode,
    commandState,
    actions,
  } = useInitiativesPage()

  const workspaceItems = pendingStatuses?.length ? items.filter((item) => pendingStatuses.includes(item.status)) : items

  return (
    <div className="initiatives-app">
      <main className="initiatives-container">
        <div style={styles.pageFrame}>
          <CommandBar
            selectedId={selectedId ?? null}
            selectedStatus={selectedStatus}
            totalLoaded={workspaceItems.length}
            filters={filters}
            onChangeFilters={actions.setFiltersDraft}
            visibility={visibility}
            workspaceTitle={title}
            sendToApprovalLabel={sendToApprovalLabel}
            backStatusLabel={backStatusLabel}
            commandState={commandState}
            onApply={actions.applyFilters}
            onClear={actions.clearFilters}
            onRefresh={actions.refresh}
            onNew={actions.openCreate}
            onView={actions.openView}
            onEdit={actions.openEdit}
            onDuplicate={actions.duplicateSelected}
            onDelete={actions.deleteSelected}
            onSendToApproval={() => onSendToApproval({ selectedStatus, actions })}
            onBackStatus={() => onBackStatus({ selectedStatus, actions })}
            onExport={() => {
              // Reserved for export integration.
            }}
          />

          <section style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <InitiativesTableSection
                items={workspaceItems}
                selectedId={selectedId}
                onSelect={actions.select}
                totalCount={totalCount}
                totalLoaded={rawItems.length}
                hasMore={Boolean(nextPageToken)}
                paginationState={paginationState}
                paginationErrorMessage={paginationErrorMessage}
                onLoadMore={actions.loadMore}
              />
            </div>

            <aside style={{ ...styles.rightColumn, display: 'grid', gap: 12, gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
              <div style={styles.summaryPanel}>
                <InitiativeSummarySection
                  selectedId={selectedId ?? null}
                  selectedFull={selectedItemDetail}
                  selectedFullState={selectedItemDetailState}
                />
              </div>

              <div style={styles.summaryPanel}>
                <StagePendingPanel selectedInitiative={selectedItemDetail} roleLabel={roleLabel} />
              </div>
            </aside>
          </section>
        </div>
      </main>

      <InitiativeWizardModal
        isOpen={isWizardOpen}
        mode={wizardMode}
        selectedInitiative={selectedItemDetail}
        onClose={actions.closeWizard}
        onSaveSuccess={actions.completeWizardSave}
        allowedStepIds={allowedStepIds}
        allowSave={allowSaveInWizard}
      />
    </div>
  )
}

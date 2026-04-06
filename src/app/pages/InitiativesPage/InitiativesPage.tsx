import { useState } from 'react'
import { CommandBar, type CommandBarFilters } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import { InitiativeWizardModal } from './InitiativeWizardModal'
import { InitiativesTableSection } from './components/InitiativesTableSection'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'
import { useInitiativesPage } from './hooks/useInitiativesPage'
import { useAccess } from '../../access/AccessContext'
import { resolveWorkspaceByRole } from './workspaces'

const initialFilters: CommandBarFilters = {
  searchTitle: '',
  status: '',
  unit: '',
  sortBy: 'Title',
  sortDir: 'asc',
}

export function InitiativesPage() {
  const { context } = useAccess()
  const { items, selectedId, selectedStatus, selectedItemDetail, selectedItemDetailState, isWizardOpen, wizardMode, isSaving, commandState, actions } =
    useInitiativesPage()
  const [filters, setFilters] = useState<CommandBarFilters>(initialFilters)
  const workspace = resolveWorkspaceByRole(context?.role)

  const filteredItems = workspace.pendingStatuses?.length
    ? items.filter((item) => workspace.pendingStatuses?.includes(item.status))
    : items

  const handleSendToApproval = () => {
    if (workspace.id === 'owner') {
      void actions.sendToLocalReview()
      return
    }

    if (workspace.id === 'localController') {
      if (selectedStatus === 'IN_REVIEW_LOCAL') {
        void actions.approveLocal()
        return
      }

      if (selectedStatus === 'LOCAL_APPROVED') {
        void actions.sendToStrategicReview()
      }
      return
    }

    if (workspace.id === 'strategicController') {
      void actions.approveStrategic()
      return
    }

    if (selectedStatus === 'LOCAL_APPROVED') {
      void actions.sendToStrategicReview()
      return
    }

    if (selectedStatus === 'IN_REVIEW_LOCAL') {
      void actions.approveLocal()
      return
    }

    if (selectedStatus === 'IN_REVIEW_STRATEGIC') {
      void actions.approveStrategic()
      return
    }

    void actions.sendToLocalReview()
  }

  const handleBackStatus = () => {
    if (workspace.id === 'localController') {
      void actions.returnToOwner()
      return
    }

    if (workspace.id === 'strategicController') {
      void actions.rejectStrategic()
      return
    }

    if (selectedStatus === 'IN_REVIEW_LOCAL') {
      void actions.returnToOwner()
      return
    }

    if (selectedStatus === 'IN_REVIEW_STRATEGIC') {
      void actions.rejectStrategic()
    }
  }

  return (
    <div className="initiatives-app">
      <main className="initiatives-container">
        <div style={styles.pageFrame}>
            <CommandBar
              selectedId={selectedId ?? null}
              selectedStatus={selectedStatus}
            totalLoaded={filteredItems.length}
            filters={filters}
            onChangeFilters={setFilters}
            visibility={workspace.commandVisibility}
            workspaceTitle={workspace.title}
            sendToApprovalLabel={workspace.sendActionLabel}
            backStatusLabel={workspace.backActionLabel}
            commandState={commandState}
            onApply={() => {
              // Reserved for filter integration on table/query.
            }}
            onClear={() => {
              setFilters(initialFilters)
            }}
            onRefresh={actions.refresh}
            onNew={actions.openCreate}
            onView={actions.openView}
            onEdit={actions.openEdit}
            onDuplicate={actions.duplicateSelected}
            onDelete={actions.deleteSelected}
            onSendToApproval={handleSendToApproval}
            onBackStatus={handleBackStatus}
            onExport={() => {
              // Reserved for export integration.
            }}
          />

          <section style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <InitiativesTableSection items={filteredItems} selectedId={selectedId} onSelect={actions.select} />
            </div>

            <aside style={styles.rightColumn}>
              <div style={styles.summaryPanel}>
                <InitiativeSummarySection
                  selectedId={selectedId ?? null}
                  selectedFull={selectedItemDetail}
                  selectedFullState={selectedItemDetailState}
                />
              </div>
            </aside>
          </section>
        </div>
      </main>

      <InitiativeWizardModal
        isOpen={isWizardOpen}
        mode={wizardMode}
        isSaving={isSaving}
        selectedInitiative={selectedItemDetail}
        onClose={actions.closeWizard}
        onSave={actions.saveFromWizard}
        allowedStepIds={workspace.wizardStepIds}
        allowSave={workspace.id !== 'strategicController'}
      />
    </div>
  )
}

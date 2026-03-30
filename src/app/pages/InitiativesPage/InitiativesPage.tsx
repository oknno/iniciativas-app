import { useMemo, useState } from 'react'
import { CommandBar } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import { InitiativeWizardModal } from './InitiativeWizardModal'
import { InitiativesTableSection } from './components/InitiativesTableSection'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'
import { mockInitiativeDetails, mockInitiativeList } from './mocks/mockInitiatives'

export function InitiativesPage() {
  const [selectedId, setSelectedId] = useState(mockInitiativeList[0]?.id)
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false)

  const selectedItem = useMemo(
    () => mockInitiativeDetails.find((item) => item.id === selectedId),
    [selectedId],
  )

  return (
    <div style={styles.page}>
      <CommandBar totalItems={mockInitiativeList.length} onOpenWizard={() => setIsWizardOpen(true)} />
      <main style={styles.content}>
        <section style={styles.mainGrid}>
          <InitiativesTableSection
            items={mockInitiativeList}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <InitiativeSummarySection item={selectedItem} />
        </section>
      </main>
      <InitiativeWizardModal
        isOpen={isWizardOpen}
        selectedInitiative={selectedItem}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { CommandBar } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import {
  InitiativesTableSection,
  type InitiativeListItem,
} from './components/InitiativesTableSection'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'

const MOCK_INITIATIVES: InitiativeListItem[] = [
  {
    id: 'INIT-001',
    title: 'Plant Energy Optimization',
    owner: 'Maria Gomez',
    stage: 'Assessment',
    status: 'In Review',
    annualGain: 780000,
  },
  {
    id: 'INIT-002',
    title: 'Supplier Rebate Redesign',
    owner: 'David Singh',
    stage: 'Validation',
    status: 'Approved',
    annualGain: 520000,
  },
  {
    id: 'INIT-003',
    title: 'Packaging Material Right-sizing',
    owner: 'Nina Patel',
    stage: 'Drafting',
    status: 'Draft',
    annualGain: 245000,
  },
  {
    id: 'INIT-004',
    title: 'Outbound Logistics Consolidation',
    owner: 'Luis Herrera',
    stage: 'Governance Gate',
    status: 'Rejected',
    annualGain: 310000,
  },
]

export function InitiativesPage() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_INITIATIVES[0]?.id ?? '')

  const selectedItem = useMemo(
    () => MOCK_INITIATIVES.find((item) => item.id === selectedId),
    [selectedId],
  )

  return (
    <div style={styles.page}>
      <CommandBar totalItems={MOCK_INITIATIVES.length} />
      <main style={styles.content}>
        <section style={styles.mainGrid}>
          <InitiativesTableSection
            items={MOCK_INITIATIVES}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <InitiativeSummarySection item={selectedItem} />
        </section>
      </main>
    </div>
  )
}

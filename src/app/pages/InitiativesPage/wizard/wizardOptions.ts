import type { ReactNode } from 'react'

export type WizardStepId = 'initiative' | 'components' | 'values' | 'review'

export type WizardStepOption = {
  id: WizardStepId
  label: string
  render: () => ReactNode
}

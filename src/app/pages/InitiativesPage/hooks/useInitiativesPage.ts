import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../../components/notifications/useToast'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import type { SaveInitiativeDto } from '../../../../application/dto/initiatives/SaveInitiativeDto'
import { createInitiative } from '../../../../application/use-cases/initiatives/createInitiative'
import { deleteInitiative } from '../../../../application/use-cases/initiatives/deleteInitiative'
import { duplicateInitiative } from '../../../../application/use-cases/initiatives/duplicateInitiative'
import { getInitiativeById } from '../../../../application/use-cases/initiatives/getInitiativeById'
import { getInitiatives } from '../../../../application/use-cases/initiatives/getInitiatives'
import { updateInitiative } from '../../../../application/use-cases/initiatives/updateInitiative'
import { useInitiativeSelection } from './useInitiativeSelection'

export type InitiativeWizardMode = 'create' | 'edit'

const toListItem = (detail: InitiativeDetailDto): InitiativeListItemDto => ({
  id: detail.id,
  code: detail.code,
  title: detail.title,
  owner: detail.owner,
  stage: detail.stage,
  status: detail.status,
  annualGain: detail.annualGain,
})

export function useInitiativesPage() {
  const { pushToast } = useToast()
  const [items, setItems] = useState<readonly InitiativeListItemDto[]>([])
  const [selectedItemDetail, setSelectedItemDetail] = useState<InitiativeDetailDto | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false)
  const [wizardMode, setWizardMode] = useState<InitiativeWizardMode>('create')

  const { selectedId, setSelectedId, selectAfterDelete } = useInitiativeSelection(items)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedItems = await getInitiatives()
      setItems(loadedItems)
      pushToast({ title: 'Data refreshed', message: `Loaded ${loadedItems.length} initiatives.`, tone: 'info' })
    } finally {
      setIsLoading(false)
    }
  }, [pushToast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!selectedId) {
      setSelectedItemDetail(undefined)
      return
    }

    void getInitiativeById(selectedId).then(setSelectedItemDetail)
  }, [selectedId])

  const openCreate = () => {
    setWizardMode('create')
    setIsWizardOpen(true)
  }

  const openEdit = () => {
    if (!selectedId) {
      return
    }

    setWizardMode('edit')
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
  }

  const saveFromWizard = async (input: SaveInitiativeDto) => {
    setIsSaving(true)

    try {
      const detail = wizardMode === 'create' ? await createInitiative(input) : await updateInitiative(input)

      setItems((current) => {
        const item = toListItem(detail)

        if (wizardMode === 'create') {
          return [item, ...current]
        }

        return current.map((currentItem) => (currentItem.id === detail.id ? item : currentItem))
      })

      setSelectedId(detail.id)
      setSelectedItemDetail(detail)
      setIsWizardOpen(false)
      pushToast({
        tone: 'success',
        title: wizardMode === 'create' ? 'Initiative created' : 'Initiative updated',
        message: `${detail.title} saved successfully.`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const duplicateSelected = async () => {
    if (!selectedId) {
      return
    }

    const duplicated = await duplicateInitiative(selectedId)
    setItems((current) => [toListItem(duplicated), ...current])
    setSelectedId(duplicated.id)
    setSelectedItemDetail(duplicated)
    pushToast({ tone: 'success', title: 'Initiative duplicated', message: duplicated.title })
  }

  const deleteSelected = async () => {
    if (!selectedId) {
      return
    }

    await deleteInitiative(selectedId)

    setItems((current) => current.filter((item) => item.id !== selectedId))
    selectAfterDelete(selectedId)
    pushToast({ tone: 'warning', title: 'Initiative deleted' })
  }

  const commandState = useMemo(
    () => ({
      canEdit: Boolean(selectedId),
      canDuplicate: Boolean(selectedId),
      canDelete: Boolean(selectedId),
    }),
    [selectedId],
  )

  return {
    items,
    selectedId,
    selectedItemDetail,
    isWizardOpen,
    wizardMode,
    isLoading,
    isSaving,
    commandState,
    actions: {
      select: setSelectedId,
      refresh,
      openCreate,
      openEdit,
      closeWizard,
      saveFromWizard,
      duplicateSelected,
      deleteSelected,
    },
  }
}

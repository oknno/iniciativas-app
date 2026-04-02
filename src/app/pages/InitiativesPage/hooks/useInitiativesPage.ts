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

const normalizeStatusForComparison = (status: string | undefined): string => status?.trim().toLowerCase() ?? ''

const isEditableStatus = (status: string | undefined): boolean => normalizeStatusForComparison(status) === 'em preenchimento'

const toListItem = (detail: InitiativeDetailDto): InitiativeListItemDto => ({
  id: detail.id,
  unidade: detail.unidade,
  title: detail.title,
  responsavel: detail.responsavel,
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
  const [selectedItemDetailState, setSelectedItemDetailState] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')

  const { selectedId, selectedListItem, setSelectedId, selectAfterDelete } = useInitiativeSelection(items)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedItems = await getInitiatives()
      setItems(loadedItems)
      pushToast({ title: 'Data refreshed', message: `Loaded ${loadedItems.length} initiatives.`, tone: 'info' })
    } catch (error) {
      console.error('Failed to load initiatives from SharePoint.', error)
      pushToast({ title: 'Unable to load initiatives', message: 'Try refreshing again in a few seconds.', tone: 'error' })
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
      setSelectedItemDetailState('idle')
      return
    }

    setSelectedItemDetailState('loading')

    void getInitiativeById(selectedId)
      .then((detail) => {
        setSelectedItemDetail(detail)
        setSelectedItemDetailState('loaded')
      })
      .catch((error) => {
        console.error(`Failed to load initiative details for ${selectedId}.`, error)
        pushToast({ title: 'Unable to load initiative details', tone: 'error' })
        setSelectedItemDetail(undefined)
        setSelectedItemDetailState('error')
      })
  }, [pushToast, selectedId])

  const openCreate = () => {
    setWizardMode('create')
    setIsWizardOpen(true)
  }

  const openEdit = () => {
    if (!selectedId || !isEditableStatus(selectedListItem?.status)) {
      return
    }

    setWizardMode('edit')
    setIsWizardOpen(true)
  }

  const openView = () => {
    if (!selectedId) {
      return
    }

    setWizardMode('edit')
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
  }

  const saveFromWizard = async (input: SaveInitiativeDto): Promise<InitiativeDetailDto> => {
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
      setSelectedItemDetailState('loaded')
      setIsWizardOpen(false)
      pushToast({
        tone: 'success',
        title: wizardMode === 'create' ? 'Initiative created' : 'Initiative updated',
        message: `${detail.title} saved successfully.`,
      })

      return detail
    } catch (error) {
      console.error('Failed to save initiative.', error)
      pushToast({ tone: 'error', title: 'Failed to save initiative' })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const duplicateSelected = async () => {
    if (!selectedId) {
      return
    }

    try {
      const duplicated = await duplicateInitiative(selectedId)
      setItems((current) => [toListItem(duplicated), ...current])
      setSelectedId(duplicated.id)
      setSelectedItemDetail(duplicated)
      setSelectedItemDetailState('loaded')
      pushToast({ tone: 'success', title: 'Initiative duplicated', message: duplicated.title })
    } catch (error) {
      console.error(`Failed to duplicate initiative ${selectedId}.`, error)
      pushToast({ tone: 'error', title: 'Failed to duplicate initiative' })
    }
  }

  const deleteSelected = async () => {
    if (!selectedId) {
      return
    }

    try {
      await deleteInitiative(selectedId)

      setItems((current) => current.filter((item) => item.id !== selectedId))
      selectAfterDelete(selectedId)
      pushToast({ tone: 'warning', title: 'Initiative deleted' })
    } catch (error) {
      console.error(`Failed to delete initiative ${selectedId}.`, error)
      pushToast({ tone: 'error', title: 'Failed to delete initiative' })
    }
  }

  const commandState = useMemo(
    () => ({
      canEdit: Boolean(selectedId) && isEditableStatus(selectedListItem?.status),
      canDuplicate: Boolean(selectedId),
      canDelete: Boolean(selectedId) && isEditableStatus(selectedListItem?.status),
    }),
    [selectedId, selectedListItem?.status],
  )

  const selectedStatus = selectedItemDetail?.status ?? selectedListItem?.status ?? ''

  const select = useCallback(
    (id: InitiativeDetailDto['id']) => {
      const listItem = items.find((item) => item.id === id)
      console.info('[InitiativesPage] row selected', {
        id,
        status: listItem?.status ?? '',
      })
      setSelectedId(id)
    },
    [items, setSelectedId],
  )

  useEffect(() => {
    if (!selectedId) {
      return
    }

    console.info('[InitiativesPage] selected detail state', {
      id: selectedId,
      status: selectedStatus,
      detailState: selectedItemDetailState,
    })
  }, [selectedId, selectedStatus, selectedItemDetailState])

  return {
    items,
    selectedId,
    selectedStatus,
    selectedItemDetail,
    selectedItemDetailState,
    isWizardOpen,
    wizardMode,
    isLoading,
    isSaving,
    commandState,
    actions: {
      select,
      refresh,
      openCreate,
      openView,
      openEdit,
      closeWizard,
      saveFromWizard,
      duplicateSelected,
      deleteSelected,
    },
  }
}

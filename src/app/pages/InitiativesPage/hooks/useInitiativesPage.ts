import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../../components/notifications/useToast'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import { deleteInitiative } from '../../../../application/use-cases/initiatives/deleteInitiative'
import { duplicateInitiative } from '../../../../application/use-cases/initiatives/duplicateInitiative'
import { getInitiativeById } from '../../../../application/use-cases/initiatives/getInitiativeById'
import { getInitiatives } from '../../../../application/use-cases/initiatives/getInitiatives'
import { updateInitiative } from '../../../../application/use-cases/initiatives/updateInitiative'
import { useInitiativeSelection } from './useInitiativeSelection'
import { useAccess } from '../../../access/AccessContext'

export type InitiativeWizardMode = 'create' | 'edit' | 'view'
export type CommandBarFilters = {
  searchTitle: string
  status: string
  unit: string
  year: string
  scenario: string
  sortBy: 'Title' | 'Id' | 'approvalYear'
  sortDir: 'asc' | 'desc'
}

const INITIAL_FILTERS: CommandBarFilters = {
  searchTitle: '',
  status: '',
  unit: '',
  year: '',
  scenario: '',
  sortBy: 'Title',
  sortDir: 'asc',
}
const INITIATIVES_PAGE_SIZE = 20

const normalizeStatusForComparison = (status: string | undefined): string => status?.trim().toLowerCase() ?? ''

const isEditableStatus = (status: string | undefined): boolean => ['draft_owner', 'returned_to_owner'].includes(normalizeStatusForComparison(status))
const isLocalControllerEditableStatus = (status: string | undefined): boolean =>
  ['in_review_local'].includes(normalizeStatusForComparison(status))

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
  const { actor, isConfigured, context } = useAccess()
  const [items, setItems] = useState<readonly InitiativeListItemDto[]>([])
  const [selectedItemDetail, setSelectedItemDetail] = useState<InitiativeDetailDto | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false)
  const [wizardMode, setWizardMode] = useState<InitiativeWizardMode>('create')
  const [selectedItemDetailState, setSelectedItemDetailState] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')
  const [filtersDraft, setFiltersDraft] = useState<CommandBarFilters>(INITIAL_FILTERS)
  const [filtersApplied, setFiltersApplied] = useState<CommandBarFilters>(INITIAL_FILTERS)
  const [nextPageToken, setNextPageToken] = useState<string | undefined>()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [paginationState, setPaginationState] = useState<'idle' | 'loadingMore' | 'error'>('idle')
  const [paginationErrorMessage, setPaginationErrorMessage] = useState<string | undefined>()

  const { selectedId, selectedListItem, setSelectedId, selectAfterDelete } = useInitiativeSelection(items)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedPage = await getInitiatives({ pageSize: INITIATIVES_PAGE_SIZE })
      setItems(loadedPage.items)
      setNextPageToken(loadedPage.nextPageToken)
      setTotalCount(loadedPage.totalCount)
      setPaginationState('idle')
      setPaginationErrorMessage(undefined)
      pushToast({ title: 'Data refreshed', message: `Loaded ${loadedPage.items.length} initiatives.`, tone: 'info' })
    } catch (error) {
      console.error('Failed to load initiatives from SharePoint.', error)
      pushToast({ title: 'Unable to load initiatives', message: 'Try refreshing again in a few seconds.', tone: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [pushToast])

  const loadMore = useCallback(async () => {
    if (!nextPageToken || paginationState === 'loadingMore') {
      return
    }

    setPaginationState('loadingMore')
    setPaginationErrorMessage(undefined)

    try {
      const nextPage = await getInitiatives({ pageSize: INITIATIVES_PAGE_SIZE, pageToken: nextPageToken })

      setItems((current) => [...current, ...nextPage.items])
      setNextPageToken(nextPage.nextPageToken)
      setTotalCount(nextPage.totalCount)
      setPaginationState('idle')
    } catch (error) {
      console.error('Failed to load more initiatives from SharePoint.', error)
      setPaginationState('error')
      setPaginationErrorMessage('Não foi possível carregar mais iniciativas.')
      pushToast({ title: 'Unable to load more initiatives', message: 'Try again in a few seconds.', tone: 'error' })
    }
  }, [nextPageToken, paginationState, pushToast])

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
    const canEditByRole =
      context?.role === 'CTRL_LOCAL'
        ? isLocalControllerEditableStatus(selectedListItem?.status)
        : isEditableStatus(selectedListItem?.status) || context?.isDevOrAdmin

    if (!selectedId || !canEditByRole) {
      return
    }

    setWizardMode('edit')
    setIsWizardOpen(true)
  }

  const openView = () => {
    if (!selectedId) {
      return
    }

    setWizardMode('view')
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
  }

  const updateSelectedStatus = useCallback(
    async (nextStatus: string, successTitle: string, decisionComment?: string) => {
      if (!selectedId || !selectedItemDetail || !isConfigured || !actor) {
        return
      }

      try {
        const updated = await updateInitiative(
          {
            id: selectedItemDetail.id,
            title: selectedItemDetail.title,
            unidade: selectedItemDetail.unidade,
            responsavel: selectedItemDetail.responsavel,
            stage: selectedItemDetail.stage,
            status: nextStatus,
            decisionComment,
          },
          actor,
        )

        setItems((current) => current.map((item) => (item.id === updated.id ? toListItem(updated) : item)))
        setSelectedItemDetail(updated)
        setSelectedItemDetailState('loaded')
        pushToast({ tone: 'success', title: successTitle, message: updated.title })
      } catch (error) {
        console.error(`Failed to transition initiative ${selectedId} to ${nextStatus}.`, error)
        pushToast({ tone: 'error', title: 'Falha ao atualizar status' })
      }
    },
    [actor, isConfigured, pushToast, selectedId, selectedItemDetail],
  )

  const completeWizardSave = (detail: InitiativeDetailDto) => {
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
      canEdit:
        Boolean(selectedId) &&
        (context?.role === 'CTRL_LOCAL'
          ? isLocalControllerEditableStatus(selectedListItem?.status)
          : isEditableStatus(selectedListItem?.status) || Boolean(context?.isDevOrAdmin)),
      canDuplicate: Boolean(selectedId),
      canDelete: Boolean(selectedId) && (isEditableStatus(selectedListItem?.status) || Boolean(context?.isDevOrAdmin)),
    }),
    [context?.isDevOrAdmin, context?.role, selectedId, selectedListItem?.status],
  )

  const selectedStatus = selectedItemDetail?.status ?? selectedListItem?.status ?? ''

  const select = useCallback(
    (id: InitiativeDetailDto['id']) => {
      setSelectedId(id)
    },
    [setSelectedId],
  )

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (filtersApplied.searchTitle && !item.title.toLowerCase().includes(filtersApplied.searchTitle.toLowerCase())) {
        return false
      }

      if (filtersApplied.status && item.status !== filtersApplied.status) {
        return false
      }

      if (filtersApplied.unit && !item.unidade.toLowerCase().includes(filtersApplied.unit.toLowerCase())) {
        return false
      }

      return true
    })

    const sorted = [...filtered].sort((left, right) => {
      const direction = filtersApplied.sortDir === 'asc' ? 1 : -1

      if (filtersApplied.sortBy === 'Id') {
        return left.id.localeCompare(right.id) * direction
      }

      if (filtersApplied.sortBy === 'approvalYear') {
        return left.stage.localeCompare(right.stage) * direction
      }

      return left.title.localeCompare(right.title) * direction
    })

    return sorted
  }, [filtersApplied, items])

  return {
    items: filteredAndSortedItems,
    rawItems: items,
    filters: filtersDraft,
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
    isLoading,
    commandState,
    actions: {
      select,
      refresh,
      loadMore,
      setFiltersDraft,
      applyFilters: () => setFiltersApplied(filtersDraft),
      clearFilters: () => {
        setFiltersDraft(INITIAL_FILTERS)
        setFiltersApplied(INITIAL_FILTERS)
      },
      openCreate,
      openView,
      openEdit,
      closeWizard,
      completeWizardSave,
      duplicateSelected,
      deleteSelected,
      sendToLocalReview: () => updateSelectedStatus('IN_REVIEW_LOCAL', 'Enviado para validação local'),
      returnToOwner: () => {
        const comment = window.prompt('Informe o comentário obrigatório para devolução:')?.trim()
        if (!comment) {
          pushToast({ tone: 'warning', title: 'Comentário obrigatório para devolução' })
          return
        }

        void updateSelectedStatus('RETURNED_TO_OWNER', 'Iniciativa devolvida para owner', comment)
      },
      sendToStrategicReview: () => updateSelectedStatus('IN_REVIEW_STRATEGIC', 'Enviado para validação estratégica'),
      approveStrategic: () => updateSelectedStatus('STRATEGIC_APPROVED', 'Validação estratégica aprovada'),
      returnToOwnerFromStrategic: () => {
        const comment = window.prompt('Informe o comentário obrigatório para devolução:')?.trim()
        if (!comment) {
          pushToast({ tone: 'warning', title: 'Comentário obrigatório para devolução' })
          return
        }

        void updateSelectedStatus('RETURNED_TO_OWNER', 'Iniciativa devolvida para owner', comment)
      },
    },
  }
}

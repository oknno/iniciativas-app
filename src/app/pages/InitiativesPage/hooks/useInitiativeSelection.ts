import { useEffect, useMemo, useState } from 'react'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import type { InitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

const getNextSelectionAfterDelete = (
  items: readonly InitiativeListItemDto[],
  deletedId: InitiativeId,
): InitiativeId | undefined => {
  const deletedIndex = items.findIndex((item) => item.id === deletedId)

  if (deletedIndex < 0) {
    return items[0]?.id
  }

  const nextItem = items[deletedIndex + 1]
  if (nextItem) {
    return nextItem.id
  }

  const previousItem = items[deletedIndex - 1]
  return previousItem?.id
}

export function useInitiativeSelection(items: readonly InitiativeListItemDto[]) {
  const [selectedId, setSelectedId] = useState<InitiativeId | undefined>(items[0]?.id)

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(undefined)
      return
    }

    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const selectedListItem = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  )

  const selectAfterDelete = (deletedId: InitiativeId) => {
    setSelectedId(getNextSelectionAfterDelete(items, deletedId))
  }

  return {
    selectedId,
    selectedListItem,
    setSelectedId,
    selectAfterDelete,
  }
}

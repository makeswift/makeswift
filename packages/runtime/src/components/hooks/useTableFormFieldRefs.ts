import { useState, useEffect, useMemo } from 'react'
import { getBox } from '../../box-model'
import { TableFormFieldsPropController } from '../../prop-controllers/instances'
import { useIsInBuilder } from '../../react'

export function useTableFormFieldRefs(
  propController: TableFormFieldsPropController | null | undefined,
  { fieldsCount }: { fieldsCount: number },
): {
  container: (arg0: HTMLElement | null | undefined) => void
  items: Array<(arg0: HTMLElement | null | undefined) => void>
} {
  const [container, setContainer] = useState<HTMLElement | null | undefined>(null)
  const [items, setItems] = useState<Array<HTMLElement | null | undefined>>(
    Array(fieldsCount + 1).fill(null),
  )

  const isInBuilder = useIsInBuilder()

  useEffect(() => {
    if (!isInBuilder) return

    let animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }

    function handleAnimationFrameRequest() {
      if (propController == null) return

      if (container != null) propController.tableFormLayoutChange({ layout: getBox(container) })

      items.map((item, index) => {
        if (item == null) return

        propController.tableFormFieldLayoutChange({ index, layout: getBox(item) })
      })

      animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
    }
  }, [propController, container, items, isInBuilder])

  const itemRefs = useMemo(
    () =>
      Array.from({ length: fieldsCount + 1 }).map(
        (_, index) => (item: HTMLElement | null | undefined) => {
          setItems(is => [...is.slice(0, index), item, ...is.slice(index + 1)])
        },
      ),
    [fieldsCount, setItems],
  )

  return { container: setContainer, items: itemRefs }
}

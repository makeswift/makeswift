import { type PointerEvent, type ComponentProps, useCallback } from 'react'
import { type Editor } from 'slate'
import { Editable } from 'slate-react'

import { getHTMLElement } from './utils'

export function useTrackMouseSelection(editor: Editor): Partial<ComponentProps<typeof Editable>> {
  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (event.button !== 0) return
      editor.selectionInProgress = true

      // set pointer capture on mouse button down so we get an event
      // even if the button is released over the builder overlay
      const element = getHTMLElement(editor)
      element.setPointerCapture(event.pointerId)
    },
    [editor],
  )

  const stopSelecting = useCallback(
    (event: PointerEvent) => {
      const wasSelecting = editor.selectionInProgress
      editor.selectionInProgress = false

      const element = getHTMLElement(editor)
      element.releasePointerCapture(event.pointerId)

      if (wasSelecting) editor.onChange()
    },
    [editor],
  )

  return {
    onPointerDown,
    onPointerUp: stopSelecting,
    onPointerCancel: stopSelecting,
    onLostPointerCapture: stopSelecting,
  }
}

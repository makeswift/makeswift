import { ReactEditor } from 'slate-react'
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import { Editor, Range as SlateRange } from 'slate'

/**
 * Clicking outside of the host blurs our `<Editable />`.
 * `<Editable />` only updates the DOM's selection to match slate when it is focused.
 * In the case of a panel being clicked this hook updates the DOM selection to match slate.
 */
export function useSyncDOMSelection(editor: Editor, hasBeenSelected: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!hasBeenSelected || editor.selection == null || ReactEditor.isFocused(editor)) return
    try {
      const root = ReactEditor.findDocumentOrShadowRoot(editor) as Document
      const domSelection = root.getSelection()
      const newDomRange: Range | null = ReactEditor.toDOMRange(editor, editor.selection)

      if (newDomRange) {
        if (SlateRange.isBackward(editor.selection!)) {
          domSelection?.setBaseAndExtent(
            newDomRange.endContainer,
            newDomRange.endOffset,
            newDomRange.startContainer,
            newDomRange.startOffset,
          )
        } else {
          domSelection?.setBaseAndExtent(
            newDomRange.startContainer,
            newDomRange.startOffset,
            newDomRange.endContainer,
            newDomRange.endOffset,
          )
        }
      } else {
        domSelection?.removeAllRanges()
      }
    } catch (e) {
      console.error(e)
    }
  })
}

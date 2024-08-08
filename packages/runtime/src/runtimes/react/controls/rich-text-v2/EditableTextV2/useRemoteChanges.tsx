import { useEffect } from 'react'
import { Editor } from 'slate'

import { RichText, RichTextDataV2 } from '../../../../../controls/rich-text-v2'
import { LocalChange } from '../../../../../slate'
import { useIsInBuilder } from '../../../hooks/use-is-in-builder'

// From the component point of view we can't know if the change came from an action or a undo/redo
// So we diff the time and force updates on actions that occured over a second ago.
function isChangeWithinPreviousSec(change?: LocalChange) {
  return performance.now() - (change?.time ?? 0) < 1000
}

export function useSyncRemoteChanges(editor: Editor, data?: RichTextDataV2) {
  const isInBuilder = useIsInBuilder()

  useEffect(() => {
    if (
      !isChangeWithinPreviousSec(editor.localChanges.get(data?.key ?? '')) &&
      data &&
      isInBuilder
    ) {
      editor.children = RichText.dataToNodes(data)
      editor.selection = editor?.localChanges.get(data.key)?.selection ?? null
      editor.onChange()
    }
  }, [editor, data])
}

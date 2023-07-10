import { useEffect } from 'react'
import { Editor } from 'slate'
import { useIsInBuilder } from '../../../../../react'
import { RichTextV2ControlData, richTextV2DataToDescendents } from '../../../../../controls'
import { LocalChange } from '../../../../../slate'

// From the component point of view we can't know if the change came from an action or a undo/redo
// So we diff the time and force updates on actions that occured over a second ago.
function isChangeWithinPreviousSec(change?: LocalChange) {
  return performance.now() - (change?.time ?? 0) < 1000
}

export function useSyncRemoteChanges(editor: Editor, data?: RichTextV2ControlData) {
  const isInBuilder = useIsInBuilder()

  useEffect(() => {
    if (
      !isChangeWithinPreviousSec(editor.localChanges.get(data?.key ?? '')) &&
      data &&
      isInBuilder
    ) {
      editor.children = richTextV2DataToDescendents(data)
      editor.selection = editor?.localChanges.get(data.key)?.selection ?? null
      editor.onChange()
    }
  }, [editor, data])
}

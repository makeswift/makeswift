import { useState, useEffect, useCallback } from 'react'
import { Editor } from 'slate'
import { richTextDTOtoDAO, richTextDTOtoSelection } from '../../../../controls'
import { RichTextValue } from '../../../../prop-controllers'
import deepEqual from '../../../../utils/deepEqual'

const COMMIT_DEBOUNCE_DELAY = 500

/**
 * Compare new prop value with current editor and update editor
 * if the values are not equal.
 */
export function useSyncWithBuilder(editor: Editor, text?: RichTextValue) {
  const [shouldCommit, setShouldCommit] = useState(true)

  useEffect(() => {
    if (shouldCommit && text) {
      const nextValue = richTextDTOtoDAO(text)
      const nextSelection = richTextDTOtoSelection(text)
      if (!deepEqual(editor.children, nextValue) || !deepEqual(editor.selection, nextSelection)) {
        editor.children = nextValue
        editor.selection = nextSelection
        editor.onChange()
      }
    }
  }, [editor, shouldCommit, text])

  useEffect(() => {
    if (shouldCommit) return

    const timeoutId = window.setTimeout(() => {
      setShouldCommit(true)
    }, COMMIT_DEBOUNCE_DELAY)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [shouldCommit])

  return useCallback(() => setShouldCommit(false), [])
}

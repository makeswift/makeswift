import { useState, useEffect, useCallback } from 'react'
import { Editor } from 'slate'
import { type RichTextDTO, richTextDTOtoDAO, richTextDTOtoSelection } from '@makeswift/controls'

import { useIsInBuilder } from '../../../../../react'
import deepEqual from '../../../../../utils/deepEqual'

const COMMIT_DEBOUNCE_DELAY = 500

/**
 * Compare new prop value with current editor and update editor
 * if the values are not equal.
 */
export function useSyncWithBuilder(editor: Editor, text?: RichTextDTO) {
  const [shouldCommit, setShouldCommit] = useState(true)
  const isInBuilder = useIsInBuilder()

  useEffect(() => {
    if (shouldCommit && text && isInBuilder) {
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

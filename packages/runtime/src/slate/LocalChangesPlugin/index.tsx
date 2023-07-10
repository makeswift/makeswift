import { BaseEditor, Editor, Selection } from 'slate'
import { v4 as uuid } from 'uuid'

export type LocalChange = { selection: Selection; time: number }

export interface LocalChangesEditor extends BaseEditor {
  localChanges: Map<string, LocalChange>
  recentKeys: Map<string, number>
  recentLocalChanges: { time: number; key: string }[]
  currentKey: string
}

export function withLocalChanges(editor: Editor): Editor {
  editor.localChanges = new Map<string, LocalChange>()
  editor.recentLocalChanges = []
  editor.currentKey = ''

  const _onChange = editor.onChange
  editor.onChange = options => {
    _onChange(options)
    if (editor == null || options?.operation == null) return

    const key = uuid()
    editor.localChanges.set(key, { selection: editor.selection, time: performance.now() })
    editor.currentKey = key
  }

  return editor
}

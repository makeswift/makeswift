import {
  FocusEvent,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Descendant, Editor, createEditor, Range as SlateRange } from 'slate'
import isHotkey from 'is-hotkey'
import { withHistory, HistoryEditor } from 'slate-history'
import {
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
} from 'slate-react'

import {
  BlockType,
  RichTextV2Control,
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
} from '../../../controls'
import { useBuilderEditMode } from '..'
import { BuilderEditMode } from '../../../state/modules/builder-edit-mode'
import { pollBoxModel } from '../poll-box-model'
import { useIsomorphicLayoutEffect } from '../../../components/hooks/useIsomorphicLayoutEffect'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2ControlDefinition }

const defaultText: Descendant[] = [{ type: BlockType.Text, children: [{ text: '' }] }]

/**
 * Clicking outside of the host blurs our `<Editable />`.
 * `<Editable />` only updates the DOM's selection to match slate when it is focused.
 * In the case of a panel being clicked this hook updates the DOM selection to match slate.
 */
export function useSyncDOMSelection(editor: Editor, isEnabled: MutableRefObject<boolean>) {
  useIsomorphicLayoutEffect(() => {
    if (!isEnabled.current || editor.selection == null || ReactEditor.isFocused(editor)) return
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

export function useRichTextV2(data: RichTextV2ControlData, control: RichTextV2Control | null) {
  const [editor] = useState(() => withHistory(withReact(createEditor())))
  const isPreservingFocus = useRef(false)
  // useSyncDOMSelection(editor, isPreservingFocus)

  const editMode = useBuilderEditMode()

  useEffect(() => {
    if (control == null) return

    const element = ReactEditor.toDOMNode(editor, editor)
    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
    })
  }, [editor, control])

  const renderElement = useCallback(({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  const renderLeaf = useCallback(({ attributes, children }: RenderLeafProps) => {
    return <span {...attributes}>{children}</span>
  }, [])

  const initialValue = useMemo(() => data ?? defaultText, [data])

  useEffect(() => {
    /**
     * This is required because clicking on the overlay has `relatedTarget` null just like the sidebar, but
     * - in the case of the overlay we switch to BUILD mode
     * - in the case of the sidebar we preserve the selection
     */
    if (editMode !== BuilderEditMode.CONTENT) {
      isPreservingFocus.current = false
      ReactEditor.deselect(editor)
    }
  }, [editMode])

  useEffect(() => {
    control?.setEditor(editor)
    control?.setDefaultValue(defaultText)
  }, [control, editor, defaultText])

  const handleFocus = useCallback(() => {
    isPreservingFocus.current = true
    control?.select()
  }, [control])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHotkey('mod+shift+z', e)) return HistoryEditor.redo(editor)
      if (isHotkey('mod+z', e)) return HistoryEditor.undo(editor)
      if (isHotkey('escape')(e)) {
        isPreservingFocus.current = false
        ReactEditor.blur(editor)
        control?.switchToBuildMode()
      }
    },
    [control, editor],
  )

  const handleBlur = useCallback((e: FocusEvent) => {
    // outside of iframe (overlay, sidebar, etc)
    if (e.relatedTarget == null) return
    // another text
    if (e.relatedTarget?.getAttribute('contenteditable') === 'true')
      isPreservingFocus.current = false
  }, [])

  const handleOnChange = useCallback(
    (value: Descendant[]) => {
      control?.onChange(value)
    },
    [control],
  )

  return (
    <Slate editor={editor} onChange={handleOnChange} value={initialValue}>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        readOnly={editMode !== BuilderEditMode.CONTENT}
        placeholder="Write some text..."
      />
    </Slate>
  )
}

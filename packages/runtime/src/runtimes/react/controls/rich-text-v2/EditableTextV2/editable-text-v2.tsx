'use client'

import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createEditor } from 'slate'
import isHotkey from 'is-hotkey'
import {
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
} from 'slate-react'

import {
  RichTextV2Definition,
  RichText,
  RichTextV2Control,
  type RichTextDataV2,
} from '../../../../../controls/rich-text-v2'

import { useBuilderEditMode } from '../../../hooks/use-builder-edit-mode'
import { BuilderEditMode } from '../../../../../state/modules/builder-edit-mode'
import { pollBoxModel } from '../../../poll-box-model'
import { withBuilder, withLocalChanges } from '../../../../../slate'
import { useSyncDOMSelection } from './useSyncDOMSelection'
import { RichTextV2Element } from './render-element'
import { RichTextV2Leaf } from './render-leaf'
import { useSyncRemoteChanges } from './useRemoteChanges'
import { defaultValue, usePresetValue } from './usePresetValue'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2Definition }

type Props = {
  text?: RichTextDataV2
  definition: RichTextV2Definition
  control: RichTextV2Control | null
}

export function EditableTextV2({ text, definition, control }: Props) {
  const plugins = useMemo(() => definition.config.plugins, [definition])

  const [editor] = useState(() =>
    plugins.reduceRight(
      (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
      withLocalChanges(withBuilder(withReact(createEditor()))),
    ),
  )

  useEffect(() => {
    if (control == null) return

    const element = ReactEditor.toDOMNode(editor, editor)
    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
    })
  }, [editor, control])

  // ------ Preserving selection ------

  const isPreservingFocus = useRef(false)
  useSyncDOMSelection(editor, isPreservingFocus)
  const editMode = useBuilderEditMode()

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

  // ------ Syncing remote changes ------

  useSyncRemoteChanges(editor, text)

  // ------ Default value ------

  const presetValue = usePresetValue(definition)

  const initialValue = useMemo(
    () => (text && RichText.dataToNodes(text)) ?? presetValue,
    [text, presetValue],
  )

  useEffect(() => {
    control?.setEditor(editor)
    control?.setDefaultValue(defaultValue)
  }, [control, editor])

  /**
   * When initialValue is set to the default value we need to trigger an local change so that the sidebar updates and so the data is saved
   */
  useEffect(() => {
    if (initialValue === presetValue) {
      control?.onLocalUserChange()
    }
  }, [control, initialValue, presetValue])

  // ------ Rendering ------

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      return <RichTextV2Element {...props} definition={definition} plugins={plugins} />
    },
    [plugins, definition],
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      return <RichTextV2Leaf {...props} definition={definition} plugins={plugins} />
    },
    [plugins, definition],
  )

  // ------ Event handlers ------

  const handleFocus = useCallback(() => {
    isPreservingFocus.current = true
    control?.select()
  }, [control])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHotkey('mod+shift+z', e)) return control?.redo()
      if (isHotkey('mod+z', e)) return control?.undo()
      if (isHotkey('escape')(e)) {
        isPreservingFocus.current = false
        ReactEditor.blur(editor)
        control?.switchToBuildMode()
      }

      if (editMode === BuilderEditMode.CONTENT) {
        e.stopPropagation()
      }

      plugins.forEach(plugin => plugin?.onKeyDown?.(e, editor))
    },
    [control, plugins, editor, editMode],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (editMode === BuilderEditMode.CONTENT) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [control, editor, editMode],
  )

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (editMode === BuilderEditMode.CONTENT) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [editMode],
  )

  const handleBlur = useCallback((e: FocusEvent) => {
    // outside of iframe (overlay, sidebar, etc)
    if (e.relatedTarget == null) return
    // another text
    if (e.relatedTarget?.getAttribute('contenteditable') === 'true')
      isPreservingFocus.current = false
  }, [])

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
        onBlur={handleBlur}
        readOnly={editMode !== BuilderEditMode.CONTENT}
        placeholder="Write some text..."
      />
    </Slate>
  )
}

export default EditableTextV2

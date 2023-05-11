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
import { Descendant, createEditor } from 'slate'
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
  RichTextV2Control,
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
  RichTextV2Mode,
} from '../../../../../controls'
import { useBuilderEditMode } from '../../..'
import { BuilderEditMode } from '../../../../../state/modules/builder-edit-mode'
import { pollBoxModel } from '../../../poll-box-model'
import { InlineModePlugin, withBuilder } from '../../../../../slate'
import { useSyncDOMSelection } from './useSyncDOMSelection'
import { BlockType } from '../../../../../slate'
import { useStyle } from '../../../use-style'
import { cx } from '@emotion/css'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2ControlDefinition }

const defaultText: Descendant[] = [{ type: BlockType.Text, children: [{ text: '' }] }]

type Props = {
  text: RichTextV2ControlData
  control: RichTextV2Control | null
}

export function EditableTextV2({ text, control }: Props) {
  const plugins = useMemo(() => {
    const plugins = [
      ...(control?.descriptor?.config?.plugins ?? []),
      ...(control?.descriptor?.config?.mode === RichTextV2Mode.Inline ? [InlineModePlugin] : []),
    ]
    return plugins
  }, [control?.descriptor.config])

  const [editor] = useState(() =>
    plugins.reduceRight(
      (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
      withBuilder(withHistory(withReact(createEditor()))),
    ),
  )

  const isPreservingFocus = useRef(false)
  useSyncDOMSelection(editor, isPreservingFocus)

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
    // TODO: move this markup into the block plugin once we have a way of composing render functionality.
    const blockStyles = [useStyle({ margin: 0 })]

    switch (element.type) {
      case BlockType.Text:
        return (
          <span {...attributes} className={cx(...blockStyles)}>
            {children}
          </span>
        )
      case BlockType.Paragraph:
        return (
          <p {...attributes} className={cx(...blockStyles)}>
            {children}
          </p>
        )
      case BlockType.Heading1:
        return (
          <h1 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h1>
        )
      case BlockType.Heading2:
        return (
          <h2 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h2>
        )
      case BlockType.Heading3:
        return (
          <h3 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h3>
        )
      case BlockType.Heading4:
        return (
          <h4 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h4>
        )
      case BlockType.Heading5:
        return (
          <h5 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h5>
        )
      case BlockType.Heading6:
        return (
          <h6 {...attributes} className={cx(...blockStyles)}>
            {children}
          </h6>
        )
      case BlockType.Default:
      default:
        if (control?.descriptor.config.mode === RichTextV2Mode.Inline) {
          return <span {...attributes}>{children}</span>
        }

        return <p {...attributes}>{children}</p>
    }
  }, [])

  const renderLeaf = useCallback(({ attributes, children }: RenderLeafProps) => {
    return <span {...attributes}>{children}</span>
  }, [])

  const initialValue = useMemo(() => text ?? defaultText, [text])

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

      plugins.forEach(plugin => plugin?.onKeyDown?.(e))
    },
    [control, plugins, editor],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (editMode === BuilderEditMode.CONTENT) e.preventDefault()
    },
    [control, editor, editMode],
  )

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (editMode === BuilderEditMode.CONTENT) e.stopPropagation()
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

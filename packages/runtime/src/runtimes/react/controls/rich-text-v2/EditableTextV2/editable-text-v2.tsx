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
  RichTextV2Plugin,
} from '../../../../../controls'
import { useBuilderEditMode } from '../../..'
import { BuilderEditMode } from '../../../../../state/modules/builder-edit-mode'
import { pollBoxModel } from '../../../poll-box-model'
import { InlineModePlugin, withBuilder } from '../../../../../slate'
import { useSyncDOMSelection } from './useSyncDOMSelection'
import { BlockType } from '../../../../../slate'
import { useStyle } from '../../../use-style'
import { cx } from '@emotion/css'
import { ControlValue } from '../../control'

type RichTextV2ElementProps = RenderElementProps & {
  definition: RichTextV2ControlDefinition
  plugins: RichTextV2Plugin[]
}

function RichTextV2Element({ definition, plugins, ...props }: RichTextV2ElementProps) {
  const blockStyles = [useStyle({ margin: 0 })]

  function initialRenderElement(props: RenderElementProps) {
    switch (props.element.type) {
      case BlockType.Default:
      default:
        if (definition.config.mode === RichTextV2Mode.Inline) {
          return (
            <span {...props.attributes} className={cx(...blockStyles)}>
              {props.children}
            </span>
          )
        }

        return (
          <p {...props.attributes} className={cx(...blockStyles)}>
            {props.children}
          </p>
        )
    }
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin) => (props: RenderElementProps) => {
      const { control, renderElement } = plugin

      if (control?.definition == null || renderElement == null) return renderFn(props)

      if (control.getElementValue == null) return renderElement(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getElementValue(props.element)}>
          {value => renderElement(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderElement,
  )

  return renderElement(props)
}

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2ControlDefinition }

const defaultText: Descendant[] = [{ type: BlockType.Default, children: [{ text: '' }] }]

type Props = {
  text: RichTextV2ControlData
  definition: RichTextV2ControlDefinition
  control: RichTextV2Control | null
}

export function EditableTextV2({ text, definition, control }: Props) {
  const plugins = useMemo(() => {
    const plugins = [
      ...(definition?.config?.plugins ?? []),
      ...(definition?.config?.mode === RichTextV2Mode.Inline ? [InlineModePlugin] : []),
    ]
    return plugins
  }, [definition])

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

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      return <RichTextV2Element {...props} definition={definition} plugins={plugins} />
    },
    [plugins, definition],
  )

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

      plugins.forEach(plugin => plugin?.onKeyDown?.(e, editor))
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

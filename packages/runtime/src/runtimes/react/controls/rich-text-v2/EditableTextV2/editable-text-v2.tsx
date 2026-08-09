'use client'

import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createEditor, NodeEntry, Range, Text as SlateText } from 'slate'
import isHotkey from 'is-hotkey'
import {
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
} from 'slate-react'

import { type ControlInstanceKey, type ConfigType } from '@makeswift/controls'

import {
  RichTextV2Definition,
  RichText,
  RichTextV2Control,
  type RichTextDataV2,
} from '../../../../../controls/rich-text-v2'

import { useBuilderEditMode } from '../../../hooks/use-builder-edit-mode'
import { useControlInstance } from '../../../hooks/use-control-instance'
import { useSlateReset } from '../../use-slate-reset'
import { BuilderEditMode } from '../../../../../state/modules/builder-edit-mode'
import { pollBoxModel } from '../../../poll-box-model'
import { withBuilder, withLocalChanges } from '../../../../../slate'
import { NodeValue } from '../../node-value'

import { useSyncDOMSelection } from './useSyncDOMSelection'
import { RichTextV2Element } from './render-element'
import { RichTextV2Leaf } from './render-leaf'
import { useSyncRemoteChanges } from './useRemoteChanges'
import { defaultValue, usePresetValue } from './usePresetValue'
import { Stylesheet } from '@makeswift/controls'

type Props = {
  text?: RichTextDataV2
  config: ConfigType<RichTextV2Definition>
  instanceKey: ControlInstanceKey | undefined
  parentStylesheet: Stylesheet
}

export const EditableTextV2Value = memo(function EditableTextV2Value({
  instanceKey,
  ...props
}: Props): ReactNode {
  return (
    <NodeValue instanceKey={instanceKey}>
      <EditableTextV2 instanceKey={instanceKey} {...props} />
    </NodeValue>
  )
})

function EditableTextV2({ text, config, instanceKey, parentStylesheet }: Props) {
  const plugins = useMemo(() => new RichTextV2Definition(config).plugins, [config])
  const control = useControlInstance(instanceKey, RichTextV2Control)

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
  }, [editMode, editor])

  // ------ Syncing remote changes ------

  useSyncRemoteChanges(editor, text)

  // ------ Default value ------

  const presetValue = usePresetValue(config)

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

  /*
    This is needed for the css runtime. It tells Slate to "decorate" each leaf node with
    its root -> leaf path through the editor. This path is used as part of the unique identifier
    which is hashed into a css class name.
    
    For "normal" top-level controls, the unique identifier is simply pulled from the element key and prop path.
    For RichTextV2 plugins, the "prop path" equivalent is managed by Slate as it creates and manages Slate nodes.
    For that reason, this decorator exists so that we can surface the Slate-managed path to the css runtime for
    class name generation (and regeneration, on node insertions/deletions).
  */
  const decorate = useCallback(
    ([node, path]: NodeEntry): Range[] => {
      if (!SlateText.isText(node)) return []
      return [
        {
          anchor: { path, offset: 0 },
          focus: { path, offset: node.text.length },
          // @ts-expect-error - this is a custom property that is used by the css runtime
          _makeswiftLeafPath: `slate-editor-path-[${path.join(',')}]`,
        },
      ]
    },
    [editor],
  )

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      return (
        <RichTextV2Element
          {...props}
          plugins={plugins}
          pathComponents={[]}
          parentStylesheet={parentStylesheet}
        />
      )
    },
    [plugins, parentStylesheet],
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      return (
        <RichTextV2Leaf
          {...props}
          plugins={plugins}
          pathComponents={[]}
          parentStylesheet={parentStylesheet}
        />
      )
    },
    [plugins, parentStylesheet],
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
    [editMode],
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

  const { className: slateResetClass, styleElement: slateResetStyleElement } = useSlateReset()

  return (
    <>
      {slateResetStyleElement}
      <Slate editor={editor} value={initialValue}>
        <Editable
          className={slateResetClass}
          decorate={decorate}
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
    </>
  )
}

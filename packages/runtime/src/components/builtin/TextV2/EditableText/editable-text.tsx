import {
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { ElementIDValue, RichTextValue } from '../../../../prop-controllers/descriptors'
import { cx } from '@emotion/css'
import { DescriptorsPropControllers } from '../../../../prop-controllers/instances'
import { Descriptors } from '../../../../runtimes/react/controls/rich-text'
import { getBox } from '../../../../box-model'
import { PropControllersHandle } from '../../../../state/modules/prop-controller-handles'
import {
  BlockType,
  RichTextControlDefinitionV2,
  RichTextDAO,
  richTextDTOtoDAO,
} from '../../../../controls'
import { Leaf } from '../components/Leaf'
import { Element } from '../components/Element'
import { useSyncWithBuilder } from './useSyncWithBuilder'
import isHotkey from 'is-hotkey'
import { useBuilderEditMode } from '../../../../runtimes/react'
import { BuilderEditMode } from '../../../../state/modules/builder-edit-mode'
import { onKeyDown } from '../../../../slate'
import { pollBoxModel } from '../../../../runtimes/react/poll-box-model'
import { useSyncDOMSelection } from './useSyncDOMSelection'
import { useStyle } from '../../../../runtimes/react/use-style'
import { withHistory } from 'slate-history'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
  definition?: RichTextControlDefinitionV2
  control?:DescriptorsPropControllers<Descriptors> 
}

const defaultText: RichTextDAO = [{ type: BlockType.Text, children: [{ text: '' }] }]

export const EditableText = forwardRef(function EditableText(
  { id, text, width, margin, definition }: Props,
  ref: Ref<PropControllersHandle<Descriptors>>,
) {
  const [editor] = useState(() => {
    const baseEditor = withReact(withHistory(createEditor()))
    console.log({ definition })
    return (
      definition?.config.plugins?.reduce(
        (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
        baseEditor,
      ) ?? baseEditor
    )
  })
  const [isPreservingDOMSElection, setIsPreservingDOMSelection] = useState(false)
  useSyncDOMSelection(editor, isPreservingDOMSElection)
  const delaySync = useSyncWithBuilder(editor, text)
  const editMode = useBuilderEditMode()

  const [propControllers, setPropControllers] =
    useState<DescriptorsPropControllers<Descriptors> | null>(null)
  const controller = propControllers?.text

  useEffect(() => {
    if (controller == null) return

    const element = ReactEditor.toDOMNode(editor, editor)

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => controller.changeBoxModel(boxModel),
    })
  }, [editor, controller])

  useImperativeHandle(
    ref,
    () => ({
      getDomNode() {
        return ReactEditor.toDOMNode(editor, editor)
      },
      getBoxModel() {
        return getBox(ReactEditor.toDOMNode(editor, editor))
      },
      setPropControllers,
    }),
    [editor, setPropControllers],
  )

  const initialValue = useMemo(() => (text ? richTextDTOtoDAO(text) : defaultText), [text])

  useEffect(() => {
    controller?.setSlateEditor(editor)
  }, [controller, editor])

  const handleFocus = useCallback(() => {
    controller?.focus()
    setIsPreservingDOMSelection(true)
  }, [controller])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (editMode === BuilderEditMode.CONTENT) {
        e.stopPropagation()
      }
      definition?.config.plugins?.forEach(plugin => plugin.editableProps?.onKeyDown?.(e))
      if (isHotkey('mod+shift+z', e)) return controller?.redo()
      if (isHotkey('mod+z', e)) return controller?.undo()
      if (isHotkey('escape')(e)) return controller?.blur()
      onKeyDown(e, editor)
    },
    [controller, editor, definition, editMode],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (editMode === BuilderEditMode.CONTENT) {
        e.preventDefault()
      }
    },
    [controller, editor, definition, editMode],
  )

  const handleBlur = useCallback((e: FocusEvent) => {
    // When clicking outside of the iframe (`relatedTarget` is null) we want to preserve the DOM selection.
    if (e.relatedTarget == null) return
    // Otherwise we want to deselect on blur and stop preserving selection.
    setIsPreservingDOMSelection(false)
    controller?.blur()
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (editMode === BuilderEditMode.CONTENT) {
        e.stopPropagation()
      }
    },
    [editMode],
  )
  const editingCursor = useStyle({ cursor: 'text' })

  return (
    <Slate editor={editor} value={initialValue} onChange={delaySync}>
      <Editable
        id={id}
        renderLeaf={Leaf}
        renderElement={Element}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onClick={handleClick}
        className={cx(width, margin, editMode === BuilderEditMode.CONTENT ? editingCursor : null)}
        readOnly={editMode !== BuilderEditMode.CONTENT}
        placeholder="Write some text..."
      />
    </Slate>
  )
})

export default EditableText

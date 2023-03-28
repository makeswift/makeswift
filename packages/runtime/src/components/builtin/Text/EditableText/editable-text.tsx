import {
  forwardRef,
  KeyboardEvent,
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
import { BlockType, RichTextDAO, richTextDTOtoDAO, TextType } from '../../../../controls'
import { Leaf } from '../components/Leaf'
import { Element } from '../components/Element'
import { useSyncWithBuilder } from './useSyncWithBuilder'
import { onKeyDown, withList } from '../../../../slate/ListPlugin'
import isHotkey from 'is-hotkey'
import { useBuilderEditMode } from '../../../../runtimes/react'
import { BuilderEditMode } from '../../../../state/modules/builder-edit-mode'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const defaultText: RichTextDAO = [
  { type: BlockType.Paragraph, children: [{ type: TextType.Text, text: '' }] },
]

export const EditableText = forwardRef(function EditableText(
  { id, text, width, margin }: Props,
  ref: Ref<PropControllersHandle<Descriptors>>,
) {
  const [editor] = useState(() => withList(withReact(createEditor())))
  const delaySync = useSyncWithBuilder(editor, text)
  const editMode = useBuilderEditMode()

  const [propControllers, setPropControllers] =
    useState<DescriptorsPropControllers<Descriptors> | null>(null)
  const controller = propControllers?.text

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
  }, [controller])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHotkey('mod+shift+z', e)) return controller?.redo()
      if (isHotkey('mod+z', e)) return controller?.undo()
      if (isHotkey('escape')(e)) return controller?.blur()
      onKeyDown(e, editor)
    },
    [controller, editor],
  )

  return (
    <Slate editor={editor} value={initialValue} onChange={delaySync}>
      <Editable
        id={id}
        renderLeaf={Leaf}
        renderElement={Element}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={cx(width, margin)}
        readOnly={editMode === BuilderEditMode.INTERACT}
      />
    </Slate>
  )
})

export default EditableText

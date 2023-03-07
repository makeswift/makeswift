import { forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { createEditor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { ElementIDValue, RichTextValue } from '../../../../prop-controllers/descriptors'
import { cx } from '@emotion/css'
import { DescriptorsPropControllers } from '../../../../prop-controllers/instances'
import { Descriptors } from '../../../../runtimes/react/controls/rich-text'
import { getBox } from '../../../../box-model'
import { PropControllersHandle } from '../../../../state/modules/prop-controller-handles'
import { BlockType, RichTextDAO, richTextDTOtoDAO, TextType } from '../../../../controls'
import { Leaf } from './Leaf'
import { Element } from './Element'
import { useSyncWithBuilder } from './useSyncWithBuilder'

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
  const [editor] = useState(() => withReact(createEditor()))
  const delaySync = useSyncWithBuilder(editor, text)

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

  return (
    <Slate editor={editor} value={initialValue} onChange={delaySync}>
      <Editable id={id} renderLeaf={Leaf} renderElement={Element} className={cx(width, margin)} />
    </Slate>
  )
})

import { forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import { createEditor, Editor, Selection, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

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
import { onKeyDown, withList } from './ListPlugin'
import { FakeCursor, getSelectionRects, SelectionRect } from './fake-cursor'

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
  const editor = useMemo(() => withList(withHistory(withReact(createEditor()))), [])
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
    [setPropControllers],
  )

  const initialValue = useMemo(() => (text ? richTextDTOtoDAO(text) : defaultText), [text])

  useEffect(() => {
    controller?.setSlateEditor(editor)
  }, [controller, editor])

  const [fakeCursor, setFakeCursor] = useState<SelectionRect[]>([])

  return (
    <Slate editor={editor} value={initialValue} onChange={delaySync}>
      <Editable
        id={id}
        renderLeaf={Leaf}
        renderElement={Element}
        onKeyDown={e => onKeyDown(e, editor)}
        onFocus={e => {
          console.log('focus', e)
        }}
        onBlur={e => {
          console.log('blur', editor.selection)
          const selObj = window.getSelection()
          console.log({ selObj })
          if (editor.selection) {
            Transforms.select(editor, editor.selection)
          }
        }}
        onMouseUp={e => {
          console.log('onDragEnd')

          const selectionRects = getSelectionRects(editor)
          console.log({ range: selectionRects })

          setFakeCursor(selectionRects)
        }}
        className={cx(width, margin)}
      />
      <FakeCursor selectionRects={fakeCursor} />
    </Slate>
  )
})

import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { createEditor, Editor, NodeEntry, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps } from 'slate-react'
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
import { ElementUtils } from './ListPlugin/lib/utils/element'

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
  const [editor] = useState(() => withList(withHistory(withReact(createEditor()))))
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

  const lastActiveSelection = useRef<Range | null>(null)

  const decorate = useCallback(([node, path]: NodeEntry) => {
    if (
      (ElementUtils.isText(node) || ElementUtils.isTypography(node)) &&
      lastActiveSelection.current != null
    ) {
      const intersection = Range.intersection(
        lastActiveSelection.current,
        Editor.range(editor, path),
      )

      if (intersection == null) {
        return []
      }

      return [
        {
          selected: true,
          ...intersection,
        },
      ]
    }
    return []
  }, [])

  return (
    <Slate editor={editor} value={initialValue} onChange={delaySync}>
      <Editable
        id={id}
        decorate={decorate}
        renderLeaf={Leaf}
        renderElement={Element}
        // onSelect={() => {
        //   if (editor.selection) {
        //     lastActiveSelection.current = editor.selection
        //   }
        // }}

        onBlur={() => (lastActiveSelection.current = editor.selection)}
        onFocus={() => (lastActiveSelection.current = null)}
        onKeyDown={e => onKeyDown(e, editor)}
        className={cx(width, margin)}
      />
    </Slate>
  )
})

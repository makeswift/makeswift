import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react'

import { createEditor, BaseEditor, Descendant } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { ElementIDValue, RichTextValue } from '../../../prop-controllers/descriptors'
import { TextUnion, Leaf } from './leaf'
import { BlockElementUnion, Element, ElementUnion } from './element'
import { useStyle } from '../../../runtimes/react/use-style'
import { cx } from '@emotion/css'
import { pollBoxModel } from '../../../runtimes/react/poll-box-model'
import { DescriptorsPropControllers } from '../../../prop-controllers/instances'
import { Descriptors } from '../../../runtimes/react/controls/rich-text'
import { BoxModelHandle, getBox } from '../../../box-model'
import { PropControllersHandle } from '../../../state/modules/prop-controller-handles'
import { fromJSON, selectionFromJSON } from './migrations'
import { ValueJSON } from '../../../old-slate-types'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: ElementUnion
    Text: TextUnion
  }
}

const COMMIT_DEBOUNCE_DELAY = 500
const defaultText: ValueJSON = {
  document: { nodes: [{ object: 'block' as const, type: 'paragraph' as const, nodes: [] }] },
  data: {},
}

export const EditableTextV2 = forwardRef(function EditableTextV2(
  { id, text, width, margin }: Props,
  ref: Ref<BoxModelHandle & PropControllersHandle<Descriptors>>,
) {
  const [editor] = useState(() => withReact(createEditor()))
  const [propControllers, setPropControllers] =
    useState<DescriptorsPropControllers<Descriptors> | null>(null)
  const controller = propControllers?.text

  useEffect(() => {
    if (controller == null) return

    return pollBoxModel({
      element: ReactEditor.toDOMNode(editor, editor),
      onBoxModelChange: boxModel => controller.changeBoxModel(boxModel),
    })
  }, [editor, controller])

  useImperativeHandle(
    ref,
    () => ({
      getBoxModel() {
        return getBox(ReactEditor.toDOMNode(editor, editor))
      },
      setPropControllers,
    }),
    [editor, setPropControllers],
  )

  useEffect(() => {
    console.log(controller, propControllers)

    if (controller) controller.setSlateEditor(editor)
  }, [controller, editor])

  const [value, setValue] = useState(() => (text ? fromJSON(text) : []))

  return (
    <Slate editor={editor} value={value}>
      <Editable
        id={id}
        // onFocus={handleFocus}
        // onBlur={handleBlur}

        className={cx(useStyle({ 'ul, ol': { margin: 0 } }), width, margin)}
        renderElement={Element}
        renderLeaf={Leaf}
      />
    </Slate>
  )
})

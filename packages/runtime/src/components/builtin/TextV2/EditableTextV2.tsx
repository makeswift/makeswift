import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  MouseEvent,
} from 'react'

import { createEditor, BaseEditor, Descendant, Editor } from 'slate'
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
import { fromJSON, selectionFromJSON, toJSON } from './migrations'
import { ValueJSON } from '../../../old-slate-types'
import { BuilderEditMode } from '../../../state/modules/builder-edit-mode'
import { useBuilderEditMode } from '../../../runtimes/react'

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
      setPropControllers(asdf: any) {
        console.log('asdf', asdf)
        return setPropControllers(asdf)
      },
    }),
    [editor, setPropControllers],
  )

  const [value, setValue] = useState(() => (text ? fromJSON(text) : []))
  useEffect(() => {
    console.log('setSlateEditor', controller)

    if (controller) controller.setSlateEditor(editor, toJSON(value))
  }, [controller, editor])

  if (text) {
    console.log('render', text, fromJSON(text), toJSON(fromJSON(text)))
  }


  const editMode = useBuilderEditMode()
  const lastEditMode = useRef(editMode)
  if (lastEditMode.current !== editMode) lastEditMode.current = editMode

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // This is needed to prevent clicks from propagating in content mode.
    // This is not ideal because it might break if we implement a plugin in the future that depends on click.
    // Also, we might also want to stop hover/mousedown event
    if (lastEditMode.current === BuilderEditMode.CONTENT) event.stopPropagation()
  }

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        id={id}
        // onFocus={handleFocus}
        // onBlur={handleBlur}

        onClick={handleClick}
        className={cx(useStyle({ 'ul, ol': { margin: 0 } }), width, margin)}
        renderElement={Element}
        renderLeaf={Leaf}
      />
    </Slate>
  )
})

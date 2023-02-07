import {
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
  useRef,
  KeyboardEvent as ReactKeyboardEvent,
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { Editor, OnChangeParam } from 'slate-react'
import { Value, ValueJSON } from 'slate'
// @ts-expect-error: no types for 'slate-hotkeys'
import Hotkeys from 'slate-hotkeys'
import { isHotkey } from 'is-hotkey'

import {
  ElementIDValue,
  RichTextDescriptor,
  RichTextValue,
} from '../../../prop-controllers/descriptors'
import { BoxModelHandle, getBox } from '../../../box-model'
import { PropControllersHandle } from '../../../state/modules/prop-controller-handles'
import { RichTextEditor } from './components/RichTextEditor'
import { DescriptorsPropControllers } from '../../../prop-controllers/instances'
import { cx } from '@emotion/css'
import { useStyle } from '../../../runtimes/react/use-style'
import { pollBoxModel } from '../../../runtimes/react/poll-box-model'
import { useBuilderEditMode } from '../../../runtimes/react'
import { BuilderEditMode } from '../../../state/modules/builder-edit-mode'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const defaultText: ValueJSON = {
  document: { nodes: [{ object: 'block' as const, type: 'paragraph' as const, nodes: [] }] },
  data: {},
}

const COMMIT_DEBOUNCE_DELAY = 500

type Descriptors = { text?: RichTextDescriptor }

const EditableText = forwardRef(function EditableText(
  { id, text, width, margin }: Props,
  ref: Ref<BoxModelHandle & PropControllersHandle<Descriptors>>,
) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [propControllers, setPropControllers] =
    useState<DescriptorsPropControllers<Descriptors> | null>(null)
  const controller = propControllers?.text
  const editMode = useBuilderEditMode()

  useEffect(() => {
    const element = editor?.findDOMNode([])
    if (element == null || !(element instanceof HTMLElement) || controller == null) return
    return pollBoxModel({
      element: element,
      onBoxModelChange: boxModel => controller.changeBoxModel(boxModel),
    })
  }, [editor, controller])

  useImperativeHandle(
    ref,
    () => ({
      getBoxModel() {
        const el = editor?.findDOMNode([])

        return el instanceof Element ? getBox(el) : null
      },
      setPropControllers,
    }),
    [editor, setPropControllers],
  )

  useEffect(() => {
    if (editor) controller?.setSlateEditor(editor)
  }, [controller, editor])

  /**
   * We must keep local state so that we can reflect the user's typed changes immediately. At the
   * same time, though, the source of truth for the data is the prop data. This presents a
   * challenge: how do we keep local state in sync with the prop data without mangling user input as
   * data comes in?
   *
   * Consider, for example, that the user types "Hello". If at a later time, when the user is trying
   * to type ", world" the component re-renders with prop data "H", "He", "Hel", "Hell", "Hello", it
   * will disrupt the user's typing. This could also happen as a result of the prop data changing
   * for other reasons, like collaborators changing the prop data concurrently. We want to avoid to
   * disrupt the user's typing, while at the same time display the "true" value as quickly as
   * possible.
   *
   * The approach we take here is to commit the prop data at an opportune time: as the user is
   * typing we avoid to commit prop data. But once they've stopped typing, we commit it as soon as
   * possible. This is known as a debounce.
   */
  const [value, setValue] = useState(() => {
    const { selection, ...textWithoutSelection } = text ?? defaultText

    return Value.fromJSON(textWithoutSelection)
  })
  const [shouldCommit, setShouldCommit] = useState(true)

  useEffect(() => {
    if (shouldCommit) {
      const nextValue = Value.fromJSON(text ?? defaultText)

      setValue(currentValue =>
        currentValue.selection.isBlurred
          ? Value.fromJSON(nextValue.toJSON({ preserveSelection: false }))
          : nextValue,
      )
    }
  }, [shouldCommit, text])

  useEffect(() => {
    if (shouldCommit) return

    const timeoutId = window.setTimeout(() => {
      setShouldCommit(true)
    }, COMMIT_DEBOUNCE_DELAY)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [shouldCommit])

  function handleChange(change: OnChangeParam) {
    setValue(change.value as Value)

    if (change.value !== value) {
      setShouldCommit(false)

      controller?.onChange(change)
    }
  }

  // HACK: Slate holds on to the very first DOM event handlers passed in and doesn't update them
  // even if they change. Since `controller` is first `undefined` then we must use a ref.
  const lastController = useRef(controller)
  if (lastController.current !== controller) lastController.current = controller
  const handleFocus = useCallback(() => {
    lastController.current?.focus()
  }, [])
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent, _editor: Editor, next: () => any) => {
      if (Hotkeys.isUndo(event)) {
        lastController.current?.undo()

        return true
      }

      if (Hotkeys.isRedo(event)) {
        lastController.current?.redo()

        return true
      }

      if (isHotkey('escape')(event)) {
        lastController.current?.blur()

        return true
      }

      return next()
    },
    [],
  )
  const handleBlur = useCallback((event: ReactFocusEvent, editor: Editor, next: () => any) => {
    const selection = editor.value.selection

    next()

    // Normally, after a user highlight a text, clicking on the panel will remove the text selection.
    // This line is a workaround for that. Because the panel is not in the iframe, relatedTarget
    // would be null, and we select the previous text selection to maintain the text highlight.
    // Inspiration: https://github.com/ianstormtaylor/slate/issues/3412#issuecomment-663906003
    if (event.relatedTarget == null) editor.select(selection)
  }, [])

  // HACK: Slate holds on to the very first DOM event handlers passed in and doesn't update them
  // even if they change.
  const lastEditMode = useRef(editMode)
  if (lastEditMode.current !== editMode) lastEditMode.current = editMode

  const handleClick = (event: ReactMouseEvent, _editor: Editor, next: () => any) => {
    next()

    // This is needed to prevent clicks from propagating in content mode.
    // This is not ideal because it might break if we implement a plugin in the future that depends on click.
    // Also, we might also want to stop hover/mousedown event
    if (lastEditMode.current === BuilderEditMode.CONTENT) event.stopPropagation()
  }

  return (
    <RichTextEditor
      // @ts-expect-error: types don't allow for 'id' prop even though it's used.
      id={id}
      ref={setEditor}
      className={cx(useStyle({ 'ul, ol': { margin: 0 } }), width, margin)}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={handleClick}
      readOnly={editMode !== BuilderEditMode.CONTENT}
    />
  )
})

export default EditableText

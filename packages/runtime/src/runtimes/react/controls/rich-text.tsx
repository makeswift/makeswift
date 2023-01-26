import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  FocusEvent as ReactFocusEvent,
} from 'react'

import {
  RichTextControl,
  RichTextControlData,
  RichTextDefinition,
} from '../../../controls/rich-text'
import { Text } from '../../../components'
import { RichTextEditor } from '../../../components/builtin/Text/components/RichTextEditor'
// @ts-expect-error: no types for 'slate-hotkeys'
import Hotkeys from 'slate-hotkeys'
import { isHotkey } from 'is-hotkey'

import { Value } from 'slate'
import { Editor, OnChangeParam } from 'slate-react'
import { useIsInBuilder } from '../../../react'
import { cx } from '@emotion/css'
import { pollBoxModel } from './slot'
export type RichTextControlValue = ReactNode

const COMMIT_DEBOUNCE_DELAY = 500

export function useRichText(
  data: RichTextControlData,
  control: RichTextControl | null,
  descriptor: RichTextDefinition,
) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

  useEffect(() => {
    if (element == null || control == null) return

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
    })
  }, [element, control])

  // console.log({ data, config: definition })

  // if (value == null)
  //   return <div style={{ backgroundColor: 'blue', width: '10px', height: '10px' }} />

  useEffect(() => {
    if (editor) control?.setSlateEditor(editor)
  }, [control, editor])

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
    const { selection, ...textWithoutSelection } = data ?? descriptor.config.defaultValue

    return Value.fromJSON(textWithoutSelection)
  })
  const [shouldCommit, setShouldCommit] = useState(true)

  useEffect(() => {
    if (shouldCommit) {
      const nextValue = Value.fromJSON(data ?? descriptor.config.defaultValue)

      setValue(currentValue =>
        currentValue.selection.isBlurred
          ? Value.fromJSON(nextValue.toJSON({ preserveSelection: false }))
          : nextValue,
      )
    }
  }, [shouldCommit, data])

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

      control?.onChange(change)
    }
  }

  const lastControl = useRef(control)
  if (lastControl.current !== control) lastControl.current = control
  const handleFocus = useCallback(() => {
    lastControl.current?.focus()
  }, [])
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent, _editor: Editor, next: () => any) => {
      if (Hotkeys.isUndo(event)) {
        lastControl.current?.undo()

        return true
      }

      if (Hotkeys.isRedo(event)) {
        lastControl.current?.redo()

        return true
      }

      if (isHotkey('escape')(event)) {
        lastControl.current?.blur()

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

  const isInBuilder = useIsInBuilder()
  console.log({ render: 'rich-text' })

  return (
    <div ref={setElement} style={{ border: '1px solid black' }}>
      <RichTextEditor
        ref={setEditor}
        // className={cx(width, margin)}
        readOnly={!isInBuilder || control == null}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />

      <p>{JSON.stringify(value, null, 2)}</p>
    </div>
  )
}

// function pollBoxModel({
//   element,
//   onBoxModelChange,
// }: {
//   element: Element
//   onBoxModelChange(boxModel: BoxModel | null): void
// }): () => void {
//   let currentBoxModel: BoxModel | null = null

//   const handleAnimationFrameRequest = () => {
//     const measuredBoxModel = getBox(element)

//     if (!deepEqual(currentBoxModel, measuredBoxModel)) {
//       currentBoxModel = measuredBoxModel

//       onBoxModelChange(currentBoxModel)
//     }

//     animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
//   }

//   let animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)

//   return () => {
//     cancelAnimationFrame(animationFrameHandle)

//     onBoxModelChange(null)
//   }
// }

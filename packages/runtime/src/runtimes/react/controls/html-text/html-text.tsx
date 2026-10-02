'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef } from 'react'

import { type ControlInstanceKey } from '@makeswift/controls'

import { HtmlTextControl, type HtmlTextEditorHandle } from '../../../../controls/html-text'
import { BuilderEditMode } from '../../../../state/modules/builder-edit-mode'
import { getProp } from '../../../../utils/prop-by-path'
import { useBuilderEditMode } from '../../hooks/use-builder-edit-mode'
import { useControlInstance } from '../../hooks/use-control-instance'
import { useElementData } from '../../hooks/use-element-data'
import { pollBoxModel } from '../../poll-box-model'

export type HtmlTextEditor = HtmlTextEditorHandle & {
  /** Stops the editor, and leaves the element as it was before the mount. */
  destroy(): void
}

export type HtmlTextEditorCallbacks = {
  onChange(html: string): void
  onFocus(): void
  onUndo(): void
  onRedo(): void
  onEscape(): void
  /** The selection or its formats changed. The panel shows the new formats. */
  onFormatsChange(): void
}

/**
 * Loads the editor (see `hugerte-editor.ts`) when the page is idle, so that
 * the first double-click does not wait for it. The control exists only in the
 * builder, so other pages do not load the editor.
 */
function usePreloadEditor(control: HtmlTextControl | null): void {
  const isInBuilder = control != null

  useEffect(() => {
    if (!isInBuilder) return

    const handle = requestIdleCallback(() => {
      void import('./hugerte-editor').then(({ loadHugeRte }) => loadHugeRte())
    })

    return () => cancelIdleCallback(handle)
  }, [isInBuilder])
}

/**
 * Edits an `unstable_HtmlText` value in an element of the host page, for
 * example an element that a template rendered with the value. Render it
 * anywhere in the builder: it renders nothing, and changes only the element.
 * It does nothing if the prop is not an `unstable_HtmlText` value.
 *
 * - Build mode: the element shows the value.
 * - Content mode: the editor starts on the element. A panel format applies
 *   to the selected text.
 *
 * The builder applies an edit as a client override, so the server does not
 * render the element again. This component reads the value from the builder.
 */
export function HtmlText({
  element,
  instanceKey,
}: {
  /** The element that shows the value. */
  element: HTMLElement
  /** The element key and the prop name of the value. */
  instanceKey: ControlInstanceKey
}): ReactNode {
  const editMode = useBuilderEditMode()
  const control = useControlInstance(instanceKey, HtmlTextControl)
  const elementData = useElementData({ elementKey: instanceKey.elementKey })
  const isEditing = editMode === BuilderEditMode.CONTENT
  const data =
    control?.resolveData(
      elementData == null ? undefined : getProp(elementData.props, instanceKey.propPath),
    ) ?? null

  // The first HTML of the element, and its value. When the element shows this
  // value again, it gets this HTML exactly, with its white space.
  const original = useRef<{ html: string; value: string } | null>(null)
  if (original.current == null && data != null) {
    original.current = { html: element.innerHTML, value: data }
  }

  // The value that the element shows. `null` means unknown: the editor
  // changed the element.
  const shownData = useRef<string | null>(data)

  usePreloadEditor(control)

  // The builder needs the box of the element for the double-click.
  useEffect(() => {
    if (control == null) return

    return pollBoxModel({
      getElement: () => element,
      onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
    })
  }, [control, element])

  // Build mode: show a new value before paint.
  useLayoutEffect(() => {
    if (isEditing || data == null || shownData.current === data) return

    element.innerHTML = data === original.current?.value ? original.current.html : data
    shownData.current = data
  }, [isEditing, data, element])

  // Build mode: a new value can have new formats. In content mode, the editor
  // reports a change of the formats.
  useEffect(() => {
    if (!isEditing) control?.updateFormats()
  }, [isEditing, control, data])

  // Content mode: start the editor.
  useEffect(() => {
    if (!isEditing || control == null) return

    let stopped = false
    let editor: HtmlTextEditor | null = null
    const callbacks: HtmlTextEditorCallbacks = {
      onChange: html => control.onLocalUserChange(html),
      onFocus: () => control.select(),
      onUndo: () => control.undo(),
      onRedo: () => control.redo(),
      onEscape: () => control.switchToBuildMode(),
      onFormatsChange: () => control.updateFormats(),
    }
    import('./hugerte-editor')
      .then(({ mountHugeRte }) => mountHugeRte(element, callbacks))
      .then(mounted => {
        if (stopped) return mounted.destroy()

        editor = mounted
        shownData.current = null
        control.setEditor(mounted)
      })
      .catch((error: unknown) => console.error('HtmlText: the editor did not start', error))

    return () => {
      stopped = true
      control.releaseEditor()
      editor?.destroy()
    }
  }, [isEditing, control, element])

  // Content mode: a change from the builder (undo, reset) that is not an echo.
  useEffect(() => {
    if (!isEditing || control == null || data == null) return
    if (control.isEcho(data)) return

    control.setContent(data)
  }, [isEditing, data, control])

  return null
}

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

import { type IdleTask, queueIdleTask, whenIdle } from './idle-queue'

export type HtmlTextEditor = HtmlTextEditorHandle & {
  /** Stops the edits at once. `destroy` does the slow part later. */
  setReadOnly(): void
  /** Stops the editor. The element keeps its HTML, and gets back its attributes. */
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

/** The last editor mount of each element. */
const mounts = new WeakMap<HTMLElement, Promise<void>>()

/** The `destroy` of each element that waits for an idle time. */
const destroys = new WeakMap<HTMLElement, IdleTask>()

/**
 * Loads the editor (see `hugerte-editor.ts`) when the page is idle, so that
 * the first double-click does not wait for it. The control exists only in the
 * builder, so other pages do not load the editor.
 */
function usePreloadEditor(control: HtmlTextControl | null): void {
  const isInBuilder = control != null

  useEffect(() => {
    if (!isInBuilder) return

    return whenIdle(() => {
      void import('./hugerte-editor').then(({ loadHugeRte }) => loadHugeRte())
    }, 1000)
  }, [isInBuilder])
}

/**
 * Edits an `unstable_HtmlText` value in an element of the host page, for
 * example an element that a template rendered with the value. Render it
 * anywhere in the builder: it renders nothing, and changes only the element.
 * It does nothing if the prop is not an `unstable_HtmlText` value.
 *
 * - Build mode: the element shows the value. A panel format applies to the
 *   whole text.
 * - Content mode: the editor starts on the element. A panel format applies
 *   to the selected text.
 *
 * One HugeRTE editor costs about 15 ms of main thread time on a slow laptop.
 * So the editors start one at a time when the page is idle, and the
 * double-clicked text starts first.
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

  // Build mode: the panel changes the whole text, with a hidden editor. The
  // element shows the value. The first hidden editor also makes the first
  // content mode editor start faster.
  useEffect(() => {
    if (isEditing || control == null) return

    let stopped = false
    const task = queueIdleTask(() =>
      import('./hugerte-editor')
        .then(({ mountWholeTextEditor }) =>
          mountWholeTextEditor(element, html => control.onLocalUserChange(html)),
        )
        .then(editor => {
          if (!stopped) control.setWholeTextEditor(editor)
        })
        .catch((error: unknown) => console.error('HtmlText: the editor did not start', error)),
    )

    return () => {
      stopped = true
      task.cancel()
      control.setWholeTextEditor(null)
    }
  }, [isEditing, control, element])

  // Build mode: a new value can have new formats. In content mode, the editor
  // reports a change of the formats.
  useEffect(() => {
    if (!isEditing) control?.updateFormats()
  }, [isEditing, control, data])

  // Content mode: start the editor when the page is idle, or at once for a
  // FOCUS. A layout effect, so that the edits stop before the build mode
  // layout effect shows the value.
  useLayoutEffect(() => {
    if (!isEditing || control == null) return

    // The editor of the last content mode must stop before a new one starts.
    destroys.get(element)?.runNow()

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
    // One editor at a time on an element: a new mount waits until the last
    // mount has stopped, for example after a fast switch between the modes.
    const mount = () => {
      const mounted = (mounts.get(element) ?? Promise.resolve())
        .then(async () => {
          if (stopped) return

          const { mountHugeRte } = await import('./hugerte-editor')
          const html = element.innerHTML
          const started = await mountHugeRte(element, callbacks)

          if (stopped) {
            // Content mode ended during the mount, so there is no edit.
            started.destroy()
            element.innerHTML = html
            return
          }

          editor = started
          shownData.current = null
          control.setEditor(started)
        })
        .catch((error: unknown) => console.error('HtmlText: the editor did not start', error))

      mounts.set(element, mounted)
      return mounted
    }

    const task = queueIdleTask(mount)
    const stopFocusRequest = control.onFocusRequest(() => task.runNow())

    return () => {
      stopped = true
      stopFocusRequest()
      task.cancel()
      control.releaseEditor()

      const stopping = editor
      if (stopping == null) return

      // `destroy` costs about as much as a mount, so it also waits for an
      // idle time.
      stopping.setReadOnly()
      destroys.set(
        element,
        queueIdleTask(async () => stopping.destroy()),
      )
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

'use client'

import {
  type MutableRefObject,
  type ReactNode,
  Suspense,
  isValidElement,
  lazy,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'

import { type ControlInstanceKey } from '@makeswift/controls'

import { RichTextV2Control, type RichTextDataV2 } from '../../../../../controls/rich-text-v2'
import { BuilderEditMode } from '../../../../../state/modules/builder-edit-mode'
import { useBuilderEditMode } from '../../../hooks/use-builder-edit-mode'
import { useControlInstance } from '../../../hooks/use-control-instance'
import { useResolvedValueOverride } from '../../../hooks/use-resolved-value-override'
import { pollBoxModel } from '../../../poll-box-model'
import { RichTextV2Value } from '../rich-text-v2-value'

const PageBuilderTextEditor = lazy(() => import('./page-builder-text-editor'))

/** The element of a Page Builder widget that holds the text. */
export type PageBuilderTextHost = {
  element: HTMLElement
  /** The element accepts phrasing content only, for example an `<h2>`. */
  phrasing: boolean
  /**
   * Shows a value in `element` in build mode. It is called only when the
   * element does not show the value yet: after an edit, or after the editor
   * unmounts.
   */
  showValue: (data: RichTextDataV2 | undefined) => void
}

type Config = Parameters<typeof RichTextV2Value>[0]['config']

/**
 * The props of the resolved RichText value. A server
 * component reads them from the value and passes them on. The value node
 * itself can reach the client as a lazy reference, which has no props.
 */
export type PageBuilderTextValue = {
  data: RichTextDataV2 | undefined
  config: Config
  instanceKey: ControlInstanceKey | undefined
}

/** A client override is a `RichTextV2Value` element. */
function overrideData(node: unknown): { data: RichTextDataV2 | undefined } | null {
  if (!isValidElement<Partial<PageBuilderTextValue>>(node)) return null
  if (node.type !== RichTextV2Value && !('config' in node.props && 'instanceKey' in node.props)) {
    return null
  }

  return { data: node.props.data }
}

/**
 * Edits a RichText value in the element of a Page Builder
 * widget. Render it in a portal into `host.element`, in the builder only.
 *
 * - Build mode: it renders nothing. The element keeps its exact server HTML.
 * - Content mode: the RichText editor mounts in the element, and replaces the
 *   static HTML while it edits.
 *
 * A server component resolves the value, so an edit reaches it as a client
 * override. This component reads the override itself and keeps the same
 * editor, so the focus stays at the first edit.
 */
export function PageBuilderText({
  value,
  host,
}: {
  value: PageBuilderTextValue
  host: PageBuilderTextHost
}): ReactNode {
  const [override, shouldOverride] = useResolvedValueOverride(value.instanceKey)
  const editMode = useBuilderEditMode()

  // The data that the element shows. At first it is the server data. `null`
  // means that the element shows nothing: the editor removed it.
  const shownData = useRef<RichTextDataV2 | undefined | null>(value.data)

  const overridden = shouldOverride ? overrideData(override) : null
  const data = overridden != null ? overridden.data : value.data

  if (editMode !== BuilderEditMode.CONTENT) {
    return (
      <HostValue host={host} data={data} shownData={shownData} instanceKey={value.instanceKey} />
    )
  }

  return (
    <Suspense fallback={null}>
      <PageBuilderTextEditor
        text={data}
        config={value.config}
        instanceKey={value.instanceKey}
        host={host}
        onMount={() => {
          shownData.current = null
        }}
      />
    </Suspense>
  )
}

/**
 * Build mode: render nothing, and show a new value with `showValue`. The
 * builder still gets the box of the text, for the double-click.
 */
function HostValue({
  host,
  data,
  shownData,
  instanceKey,
}: {
  host: PageBuilderTextHost
  data: RichTextDataV2 | undefined
  shownData: MutableRefObject<RichTextDataV2 | undefined | null>
  instanceKey: ControlInstanceKey | undefined
}): ReactNode {
  const control = useControlInstance(instanceKey, RichTextV2Control)
  const { element, showValue } = host

  // Before paint, so the element is never empty after content mode ends.
  useLayoutEffect(() => {
    if (shownData.current === data) return

    showValue(data)
    shownData.current = data
  }, [data, showValue, shownData])

  useEffect(() => {
    if (control == null) return

    return pollBoxModel({
      getElement: () => element,
      onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
    })
  }, [control, element])

  return null
}

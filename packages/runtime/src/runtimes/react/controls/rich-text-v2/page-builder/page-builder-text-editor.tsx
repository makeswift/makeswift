'use client'

import { type ReactNode, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { type ControlInstanceKey } from '@makeswift/controls'

import { type RichTextDataV2 } from '../../../../../controls/rich-text-v2'
import { PageBuilderTextControl } from '../../../../../controls/rich-text-v2/page-builder'
import {
  expandRawHtmlData,
  fromHtml,
  pageBuilderHtmlPlugins,
} from '../../../../../slate/PageBuilderHtmlPlugin'
import { useControlInstance } from '../../../hooks/use-control-instance'
import { EditableTextV2 } from '../EditableTextV2/editable-text-v2'
import { type RichTextV2Value } from '../rich-text-v2-value'

import { type PageBuilderTextHost } from './page-builder-text'

/** The RichText editor in the element of a Page Builder widget. */
export default function PageBuilderTextEditor({
  text,
  config,
  instanceKey,
  host,
  onMount,
}: {
  text: RichTextDataV2 | undefined
  config: Parameters<typeof RichTextV2Value>[0]['config']
  instanceKey: ControlInstanceKey | undefined
  host: PageBuilderTextHost
  onMount: () => void
}): ReactNode {
  const control = useControlInstance(instanceKey, PageBuilderTextControl)
  const { element, phrasing } = host

  // The same plugin order as the control definition, with the rules of this host.
  const plugins = useMemo(() => pageBuilderHtmlPlugins({ phrasing }), [phrasing])

  // A field without a saved value edits the HTML that the element shows, as
  // TinyMCE does. The editor does not save the preset value of the config.
  const [unsavedData] = useState(() => (text == null ? fromHtml(element.innerHTML) : undefined))

  // Edit the expanded nodes from the start. If the first selection expanded
  // them, the DOM selection could point to a text that is not rendered yet.
  // The value keeps its key, so the expansion alone saves nothing.
  const editorText = useMemo(
    () => expandRawHtmlData(text ?? unsavedData, { phrasing }),
    [text, unsavedData, phrasing],
  )

  // The editor replaces the static HTML while it edits. Remove it before
  // paint, so the text never shows two times.
  useLayoutEffect(() => {
    const root = element.querySelector(':scope > [data-slate-editor]')

    Array.from(element.childNodes).forEach(node => {
      if (node !== root) node.remove()
    })
    onMount()
    // Once, when the editor mounts in the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])

  useEffect(() => {
    if (control == null) return

    return () => control.releaseEditor()
  }, [control])

  return (
    <EditableTextV2
      text={editorText}
      config={config}
      instanceKey={instanceKey}
      plugins={plugins}
      as={phrasing ? 'span' : undefined}
      // The Page Builder leaves render their own tags, with no stylesheet.
      parentStylesheetKey="page-builder-text"
    />
  )
}

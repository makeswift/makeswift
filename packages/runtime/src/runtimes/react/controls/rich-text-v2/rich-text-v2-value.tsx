'use client'

import { lazy } from 'react'

import { type ControlInstanceKey, type ConfigType } from '@makeswift/controls'

import { type RichTextDataV2, RichTextV2Definition } from '../../../../controls/rich-text-v2'

import { useIsReadOnly } from '../../hooks/use-is-read-only'

const EditableText = lazy(() => import('./EditableTextV2'))
const ReadOnlyText = lazy(() => import('./ReadOnlyTextV2'))

export function RichTextV2Value({
  data,
  config,
  instanceKey,
  parentStylesheetKey,
}: {
  data: RichTextDataV2 | undefined
  config: ConfigType<RichTextV2Definition>
  instanceKey: ControlInstanceKey | undefined
  parentStylesheetKey: string
}) {
  return useIsReadOnly() ? (
    <ReadOnlyText text={data} config={config} parentStylesheetKey={parentStylesheetKey} />
  ) : (
    <EditableText
      text={data}
      config={config}
      instanceKey={instanceKey}
      parentStylesheetKey={parentStylesheetKey}
    />
  )
}

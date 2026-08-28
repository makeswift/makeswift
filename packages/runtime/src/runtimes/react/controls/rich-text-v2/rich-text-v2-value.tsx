'use client'

import { lazy } from 'react'

import { type ConfigType } from '@makeswift/controls'

import {
  type RichTextDataV2,
  RichTextV2Definition,
  RichTextV2Control,
} from '../../../../controls/rich-text-v2'

import { useIsReadOnly } from '../../hooks/use-is-read-only'

const EditableText = lazy(() => import('./EditableTextV2'))
const ReadOnlyText = lazy(() => import('./ReadOnlyTextV2'))

export function RichTextV2Value({
  data,
  config,
  control,
}: {
  data: RichTextDataV2 | undefined
  config: ConfigType<RichTextV2Definition>
  control: RichTextV2Control | null
}) {
  return useIsReadOnly() ? (
    <ReadOnlyText text={data} config={config} />
  ) : (
    <EditableText text={data} config={config} control={control} />
  )
}

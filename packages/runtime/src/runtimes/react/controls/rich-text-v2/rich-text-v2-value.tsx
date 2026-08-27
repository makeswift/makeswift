'use client'

import { lazy } from 'react'

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
  definition,
  control,
}: {
  data: RichTextDataV2 | undefined
  definition: RichTextV2Definition
  control: RichTextV2Control | null
}) {
  return useIsReadOnly() ? (
    <ReadOnlyText text={data} definition={definition} />
  ) : (
    <EditableText text={data} definition={definition} control={control} />
  )
}

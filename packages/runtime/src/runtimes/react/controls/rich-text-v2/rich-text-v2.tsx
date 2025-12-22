import { ReactNode, lazy } from 'react'

import { type DataType } from '@makeswift/controls'
import {
  RichTextV2Control,
  RichTextV2Definition,
  RichTextDataV2,
} from '../../../../controls/rich-text-v2'
import { useIsReadOnly } from '../../hooks/use-is-read-only'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2Definition }

const EditableText = lazy(() => import('./EditableTextV2'))
const ReadOnlyText = lazy(() => import('./ReadOnlyTextV2'))

const ReadOnlyTextV1 = lazy(() => import('../rich-text/ReadOnlyText'))

export function renderRichTextV2(
  data: DataType<RichTextV2Definition> | undefined,
  definition: RichTextV2Definition,
  control: RichTextV2Control | null,
): ReactNode {
  return RichTextV2Definition.isV1Data(data) ? (
    <ReadOnlyTextV1 text={data} />
  ) : (
    <RichTextV2 data={data} definition={definition} control={control} />
  )
}

function RichTextV2({
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

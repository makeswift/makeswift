import { ReactNode } from 'react'

import { type DataType } from '@makeswift/controls'
import {
  RichTextV2Control,
  RichTextV2Definition,
  RichTextDataV2,
} from '../../../../controls/rich-text-v2'
import { useIsPreview } from '../../../react/hooks/use-is-preview'
import EditableText from './EditableTextV2'
import ReadOnlyText from './ReadOnlyTextV2'
import ReadOnlyTextV1 from '../rich-text/ReadOnlyText'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2Definition }

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
  return useIsPreview() ? (
    <EditableText text={data} definition={definition} control={control} />
  ) : (
    <ReadOnlyText text={data} definition={definition} />
  )
}

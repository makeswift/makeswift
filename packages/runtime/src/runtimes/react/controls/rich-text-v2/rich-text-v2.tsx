import { ReactNode, lazy } from 'react'

import { type DataType } from '@makeswift/controls'
import { RichTextV2Control, RichTextV2Definition } from '../../../../controls/rich-text-v2'
import { useIsPreview } from '../../../react'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2Definition }

const EditableText = lazy(() => import('./EditableTextV2'))
const ReadOnlyText = lazy(() => import('./ReadOnlyTextV2'))

const ReadOnlyTextV1 = lazy(() => import('../rich-text/ReadOnlyText'))

export function useRichTextV2(
  data: DataType<RichTextV2Definition>,
  definition: RichTextV2Definition,
  control: RichTextV2Control | null,
) {
  const isPreview = useIsPreview()

  if (RichTextV2Definition.isV1Data(data)) {
    return <ReadOnlyTextV1 text={data} />
  }

  return isPreview ? (
    <EditableText text={data} definition={definition} control={control} />
  ) : (
    <ReadOnlyText text={data} definition={definition} />
  )
}

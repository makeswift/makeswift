import { ReactNode, lazy } from 'react'

import {
  RichTextControlData,
  RichTextV2Control,
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
  isRichTextV1Data,
} from '../../../../controls'
import { useIsPreview } from '../../../react'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2ControlDefinition }

const EditableText = lazy(() => import('./EditableTextV2'))
const ReadOnlyText = lazy(() => import('./ReadOnlyTextV2'))

const ReadOnlyTextV1 = lazy(() => import('../rich-text/ReadOnlyText'))

export function useRichTextV2(
  data: RichTextV2ControlData | RichTextControlData,
  definition: RichTextV2ControlDefinition,
  control: RichTextV2Control | null,
) {
  const isPreview = useIsPreview()

  if (isRichTextV1Data(data)) {
    return <ReadOnlyTextV1 text={data} />
  }

  return isPreview ? (
    <EditableText text={data} definition={definition} control={control} />
  ) : (
    <ReadOnlyText text={data} definition={definition} />
  )
}

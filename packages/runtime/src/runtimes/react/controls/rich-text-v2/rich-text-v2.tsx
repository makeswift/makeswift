import { ReactNode } from 'react'

import {
  RichTextV2Control,
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
} from '../../../../controls'
import { useIsPreview } from '../../../react'
import { forwardNextDynamicRef } from '../../../../next'
import dynamic from 'next/dynamic'

export type RichTextV2ControlValue = ReactNode

export type Descriptors = { text?: RichTextV2ControlDefinition }

const EditableText = forwardNextDynamicRef(patch =>
  dynamic(() => patch(import('./EditableTextV2'))),
)
const ReadOnlyText = forwardNextDynamicRef(patch =>
  dynamic(() => patch(import('./ReadOnlyTextV2'))),
)

export function useRichTextV2(data: RichTextV2ControlData, control: RichTextV2Control | null) {
  const isPreview = useIsPreview()

  return isPreview ? <EditableText text={data} control={control} /> : <ReadOnlyText text={data} />
}

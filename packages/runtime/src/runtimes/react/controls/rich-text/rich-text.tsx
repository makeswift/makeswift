import { ReactNode, lazy, useCallback } from 'react'

import { type DataType } from '@makeswift/controls'
import { RichTextV1Control, RichTextV1Definition } from '../../../../controls/rich-text'

import {
  isPropControllersHandle,
  PropControllersHandle,
} from '../../../../state/modules/prop-controller-handles'

import { useIsPreview } from '../../hooks/use-is-preview'

const EditableText = lazy(() => import('./EditableText'))
const ReadOnlyText = lazy(() => import('./ReadOnlyText'))

export type RichTextControlValue = ReactNode

export type Descriptors = { text?: RichTextV1Definition }

export function renderRichText(
  data: DataType<RichTextV1Definition> | undefined,
  control: RichTextV1Control | null,
) {
  return <RichText data={data} control={control} />
}

function RichText({
  data,
  control,
}: {
  data: DataType<RichTextV1Definition> | undefined
  control: RichTextV1Control | null
}) {
  const textCallbackRef = useCallback(
    (handle: PropControllersHandle<Descriptors> | HTMLDivElement | null) => {
      if (isPropControllersHandle(handle))
        handle?.setPropControllers?.(control == null ? null : { text: control })
    },
    [control],
  )

  const isPreview = useIsPreview()

  return isPreview ? (
    <EditableText text={data} ref={textCallbackRef} />
  ) : (
    <ReadOnlyText text={data} ref={textCallbackRef} />
  )
}

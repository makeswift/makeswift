import dynamic from 'next/dynamic'
import { ReactNode, useCallback } from 'react'
import {
  RichTextControl,
  RichTextControlData,
  RichTextControlDefinition,
} from '../../../../controls/rich-text'
import { forwardNextDynamicRef } from '../../../../next/dynamic'
import {
  isPropControllersHandle,
  PropControllersHandle,
} from '../../../../state/modules/prop-controller-handles'
import { useIsPreview } from '../..'

const EditableText = forwardNextDynamicRef(patch => dynamic(() => patch(import('./EditableText'))))
const ReadOnlyText = forwardNextDynamicRef(patch => dynamic(() => patch(import('./ReadOnlyText'))))

export type RichTextControlValue = ReactNode

export type Descriptors = { text?: RichTextControlDefinition }

export function useRichText(data: RichTextControlData, control: RichTextControl | null) {
  const textCallbackRef = useCallback(
    (handle: PropControllersHandle<Descriptors> | HTMLDivElement) => {
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

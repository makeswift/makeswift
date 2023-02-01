import dynamic from 'next/dynamic'
import { ReactNode, useCallback } from 'react'
import {
  RichTextControl,
  RichTextControlData,
  RichTextControlDefinition,
} from '../../../controls/rich-text'
import { forwardNextDynamicRef } from '../../../next'
import {
  isPropControllersHandle,
  PropControllersHandle,
} from '../../../state/modules/prop-controller-handles'

const Text = forwardNextDynamicRef(patch =>
  dynamic(() => patch(import('../../../components/builtin/Text'))),
)

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

  return <Text text={data} ref={textCallbackRef} />
}

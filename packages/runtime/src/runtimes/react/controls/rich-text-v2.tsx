import { ReactNode, useCallback } from 'react'
import {
  RichTextControlDataV2,
  RichTextControlDefinitionV2,
  RichTextControlV2,
} from '../../../controls/rich-text'
import {
  isPropControllersHandle,
  PropControllersHandle,
} from '../../../state/modules/prop-controller-handles'
import Text from '../../../components/builtin/TextV2/Text'

export type RichTextControlValueV2 = ReactNode

export type Descriptors = { text?: RichTextControlDefinitionV2 }

export function useRichTextV2(data: RichTextControlDataV2, control: RichTextControlV2 | null) {
  const textCallbackRef = useCallback(
    (handle: PropControllersHandle<Descriptors> | HTMLDivElement) => {
      if (isPropControllersHandle(handle))
        handle?.setPropControllers?.(control == null ? null : { text: control })
    },
    [control],
  )
  console.log({ control })

  return (
    <Text text={data} ref={textCallbackRef} control={control} definition={control?.descriptor} />
  )
}

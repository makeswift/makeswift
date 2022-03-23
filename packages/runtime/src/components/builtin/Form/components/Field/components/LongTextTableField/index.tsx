import { forwardRef } from 'react'

import Label from '../Label'
import TextArea from '../TextArea'

type Props = {
  id: string
  label?: string
  error?: string
  hideLabel?: boolean
}

export default forwardRef<HTMLTextAreaElement, Props>(function LongTextTableField(
  { id, label = '', error, hideLabel = false, ...restOfProps }: Props,
  ref,
) {
  return (
    <>
      {!hideLabel && <Label htmlFor={id}>{label}</Label>}
      <TextArea {...restOfProps} aria-label={label} ref={ref} id={id} error={error != null} />
    </>
  )
})

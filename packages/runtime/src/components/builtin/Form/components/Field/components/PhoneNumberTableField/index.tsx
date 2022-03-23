import { forwardRef } from 'react'

import Label from '../Label'
import Input from '../Input'

type Props = {
  id: string
  label?: string
  name: string
  error?: string
  hideLabel?: boolean
}

export default forwardRef<HTMLInputElement, Props>(function PhoneNumberTableField(
  { id, label = '', name, error, hideLabel = false, ...restOfProps }: Props,
  ref,
) {
  return (
    <>
      {!hideLabel && <Label htmlFor={id}>{label}</Label>}
      <Input
        {...restOfProps}
        aria-label={label}
        ref={ref}
        id={id}
        name={name}
        type="tel"
        error={error != null}
      />
    </>
  )
})

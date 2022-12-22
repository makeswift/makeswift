import { ForwardedRef, forwardRef, SyntheticEvent } from 'react'
import { FormikProps } from 'formik'

import { useFormContext, Sizes } from '../../../../context/FormContext'
import Label from '../Label'
import { getSizeHeight as getInputSizeHeight } from '../Input'
import Checkbox from '../Checkbox'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import { responsiveStyle } from '../../../../../../utils/responsive-style'
import { cx } from '@emotion/css'
import { TableColumn } from '../../../../types'

type Props = {
  form: FormikProps<{
    [key: string]: boolean
  }>
  id: string
  label?: string
  name: string
  value?: boolean
  error?: string
  hideLabel?: boolean
  tableColumn?: TableColumn | null
}

export default forwardRef(function CheckboxTableField(
  {
    form,
    id,
    name,
    label = '',
    value = false,
    error,
    hideLabel,
    tableColumn,
    ...restOfProps
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { size } = useFormContext()

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    form.setFieldValue(name, event.currentTarget.checked)
  }

  return (
    <Label
      className={cx(
        useStyle({ display: 'flex', alignItems: 'center', margin: 0 }),
        useStyle(
          responsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
            minHeight: getInputSizeHeight(size),
            maxHeight: getInputSizeHeight(size),
          })),
        ),
      )}
      htmlFor={id}
    >
      <span className={useStyle({ marginRight: 8 })}>
        <Checkbox
          {...restOfProps}
          aria-label={label}
          checked={value}
          onChange={handleChange}
          ref={ref}
          id={id}
          error={error != null}
        />
      </span>
      {label}
    </Label>
  )
})

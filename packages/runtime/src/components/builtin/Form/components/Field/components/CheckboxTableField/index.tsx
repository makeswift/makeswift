import { ForwardedRef, forwardRef, SyntheticEvent } from 'react'
import { FormikProps } from 'formik'

import { useFormContext, Sizes } from '../../../../context/FormContext'
import Label from '../Label'
import { getSizeHeight as getInputSizeHeight } from '../Input'
import Checkbox from '../Checkbox'
import { useResponsiveStyle } from '../../../../../../utils/responsive-style'
import { TableColumn } from '../../../../types'
import { composeStyles, useStyle } from '../../../../../../../runtimes/react/css-runtime/hooks/use-style'

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

  const labelStyles = composeStyles(
    useStyle({ display: 'flex', alignItems: 'center', margin: 0 }),
    useStyle(
      useResponsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
        minHeight: getInputSizeHeight(size),
        maxHeight: getInputSizeHeight(size),
      })),
    )
  )
  const spanStyle = useStyle({ marginRight: 8 })

  return (
    <>
      {labelStyles.styleElements}
      <Label
        className={labelStyles.className}
        htmlFor={id}
      >
        {spanStyle.styleElement}
        <span className={spanStyle.className}>
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
    </>
  )
})

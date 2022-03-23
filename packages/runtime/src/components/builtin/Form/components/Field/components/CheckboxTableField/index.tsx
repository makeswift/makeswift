import { forwardRef, SyntheticEvent } from 'react'
import styled, { css } from 'styled-components'
import { FormikProps } from 'formik'

import { useFormContext, Sizes, Value } from '../../../../context/FormContext'
import Label from '../Label'
import { getSizeHeight as getInputSizeHeight } from '../Input'
import Checkbox from '../Checkbox'
import { cssMediaRules } from '../../../../../../utils/cssMediaRules'

const StyledLabel = styled(Label)<Pick<Value, 'size'>>`
  display: flex;
  align-items: center;
  margin: 0;
  ${props =>
    cssMediaRules(
      [props.size] as const,
      ([size = Sizes.MEDIUM]) => css`
        min-height: ${getInputSizeHeight(size)}px;
        max-height: ${getInputSizeHeight(size)}px;
      `,
    )}
`

const CheckboxContainer = styled.span`
  margin-right: 8px;
`

type Props = {
  form: FormikProps<{
    [key: string]: boolean
  }>
  id: string
  label?: string
  name: string
  value?: boolean
  error?: string
}

export default forwardRef<HTMLInputElement, Props>(function CheckboxTableField(
  { form, id, name, label = '', value = false, error, ...restOfProps }: Props,
  ref,
) {
  const { size } = useFormContext()

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    form.setFieldValue(name, event.currentTarget.checked)
  }

  return (
    <StyledLabel htmlFor={id} size={size}>
      <CheckboxContainer>
        <Checkbox
          {...restOfProps}
          aria-label={label}
          checked={value}
          onChange={handleChange}
          ref={ref}
          id={id}
          error={error != null}
        />
      </CheckboxContainer>
      {label}
    </StyledLabel>
  )
})

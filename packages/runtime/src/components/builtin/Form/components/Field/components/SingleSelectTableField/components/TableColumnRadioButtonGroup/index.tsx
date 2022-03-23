import { forwardRef, useRef, useImperativeHandle, SyntheticEvent } from 'react'
import styled from 'styled-components'

import Label from '../../../Label'
import RadioButton from '../../../RadioButton'

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  margin: 8px 0;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const RadioButtonContainer = styled.span`
  margin-right: 8px;
`

type Props = {
  id: string
  tableColumn: {
    options: Array<{
      id: string
      name: string
    }>
  }
  label?: string
  value?: string
  hideLabel?: boolean
  onChange: (arg0: SyntheticEvent<HTMLInputElement>) => unknown
  required?: boolean
}

export default forwardRef<
  {
    validity: {
      valueMissing: boolean
      typeMismatch: boolean
    }
  },
  Props
>(function TableColumnRadioButtonGroup(
  {
    tableColumn,
    label = '',
    value = '',
    required = false,
    hideLabel = false,
    onChange,
    ...restOfProps
  }: Props,
  ref,
) {
  const handle = useRef({
    validity: { valueMissing: required === true && value === '', typeMismatch: false },
  })

  useImperativeHandle(ref, () => handle.current, [])

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    handle.current.validity.valueMissing = required === true && !event.currentTarget.checked

    onChange(event)
  }

  return (
    <div>
      {!hideLabel && <Label as="p">{label}</Label>}
      {tableColumn.options.map(option => (
        <StyledLabel key={option.id} htmlFor={option.id} aria-label={label}>
          <RadioButtonContainer>
            <RadioButton
              {...restOfProps}
              onChange={handleChange}
              checked={value === option.name}
              id={option.id}
              value={option.name}
            />
          </RadioButtonContainer>
          {option.name}
        </StyledLabel>
      ))}
    </div>
  )
})

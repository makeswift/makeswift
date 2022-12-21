import { cx } from '@emotion/css'
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  SyntheticEvent,
  ComponentPropsWithoutRef,
} from 'react'
import { useStyle } from '../../../../../../../../../runtimes/react/use-style'

import Label from '../../../Label'
import RadioButton from '../../../RadioButton'

function StyledLabel({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Label>) {
  return (
    <Label
      {...restOfProps}
      className={cx(
        className,
        useStyle({
          display: 'flex',
          alignItems: 'center',
          margin: '8px 0',

          '&:last-of-type': {
            marginBottom: 0,
          },
        }),
      )}
    />
  )
}

function RadioButtonContainer({ className, ...restOfProps }: ComponentPropsWithoutRef<'span'>) {
  return <span {...restOfProps} className={cx(className, useStyle({ marginRight: 8 }))} />
}

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

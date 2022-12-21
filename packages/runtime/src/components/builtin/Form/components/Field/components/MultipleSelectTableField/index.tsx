import {
  forwardRef,
  useRef,
  useImperativeHandle,
  SyntheticEvent,
  ComponentPropsWithoutRef,
} from 'react'

import Label from '../Label'
import Checkbox from '../Checkbox'
import { cx } from '@emotion/css'
import { useStyle } from '../../../../../../../runtimes/react/use-style'

function MainLabel({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Label>) {
  return <Label {...restOfProps} className={cx(className, useStyle({ margin: '0 0 4px 0' }))} />
}

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
          '&:last-of-type': { marginBottom: 0 },
        }),
      )}
    />
  )
}

function CheckboxContainer({ className, ...restOfProps }: ComponentPropsWithoutRef<'span'>) {
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
  value?: Array<string>
  label?: string
  onChange: (arg0: SyntheticEvent<HTMLInputElement>) => unknown
  required?: boolean
  hideLabel?: boolean
}

export default forwardRef<
  {
    validity: {
      valueMissing: boolean
      typeMismatch: boolean
    }
  },
  Props
>(function MultipleSelectTableField(
  {
    tableColumn,
    label = '',
    required,
    value = [],
    onChange,
    hideLabel = false,
    ...restOfProps
  }: Props,
  ref,
) {
  const handle = useRef({
    validity: { valueMissing: required === true && value.length === 0, typeMismatch: false },
  })

  useImperativeHandle(ref, () => handle.current, [])

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    handle.current.validity.valueMissing =
      required === true &&
      !event.currentTarget.checked &&
      value.filter(v => v !== event.currentTarget.value).length === 0

    onChange(event)
  }

  return (
    <div>
      {!hideLabel && <MainLabel>{label}</MainLabel>}
      {tableColumn.options.map(option => (
        <StyledLabel key={option.id} htmlFor={option.id}>
          <CheckboxContainer>
            <Checkbox
              {...restOfProps}
              aria-label={label}
              onChange={handleChange}
              checked={value.includes(option.name)}
              id={option.id}
              value={option.name}
            />
          </CheckboxContainer>
          {option.name}
        </StyledLabel>
      ))}
    </div>
  )
})

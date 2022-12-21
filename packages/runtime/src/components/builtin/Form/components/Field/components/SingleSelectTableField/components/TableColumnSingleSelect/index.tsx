import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react'
import { useStyle } from '../../../../../../../../../runtimes/react/use-style'

import { responsiveStyle } from '../../../../../../../../utils/responsive-style'
import { useFormContext, Sizes, Contrasts, Value } from '../../../../../../context/FormContext'
import responsiveField, {
  getSizeHeight,
  getSizeHorizontalPadding,
  getContrastColor,
} from '../../../../services/responsiveField'
import Label from '../../../Label'

type BaseContainerProps = Value & { error?: boolean }

type ContainerProps = BaseContainerProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof BaseContainerProps>

function Container({
  shape,
  size,
  contrast,
  brandColor,
  error,
  className,
  ...restOfProps
}: ContainerProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        className,
        useStyle(responsiveField({ shape, size, contrast, brandColor, error })),
        useStyle({
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          userSelect: 'none',
          borderColor: '#f19eb9',

          '&:focus, &:focus-within': {
            borderColor: '#e54e7f',
          },

          ...responsiveStyle(
            [size, contrast] as const,
            ([size = Sizes.MEDIUM, contrast = Contrasts.LIGHT]) => ({
              minHeight: getSizeHeight(size),
              maxHeight: getSizeHeight(size),

              '&::after': {
                content: '""',
                position: 'absolute',
                right: getSizeHorizontalPadding(size),
                top: '50%',
                transform: 'translate3d(0, -25%, 0)',
                border: 'solid 0.35em transparent',
                borderTopColor: getContrastColor(contrast),
              },
            }),
          ),
        }),
      )}
    />
  )
}

const Select = forwardRef(function Select(
  { className, ...restOfProps }: ComponentPropsWithoutRef<'select'>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <select
      {...restOfProps}
      ref={ref}
      className={cx(
        className,
        useStyle({
          appearance: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          width: '100%',
          height: '100%',
        }),
      )}
    />
  )
})

type Props = {
  id: string
  tableColumn: {
    options: Array<{
      id: string
      name: string
    }>
  }
  value?: string
  label?: string
  required?: boolean
  error?: boolean
  hideLabel?: boolean
  form?: unknown
}

export default forwardRef<HTMLSelectElement, Props>(function TableColumnSingleSelect(
  {
    id,
    tableColumn,
    value = '',
    label = '',
    error = false,
    hideLabel = false,
    form,
    ...restOfProps
  }: Props,
  ref,
) {
  const { shape, size, contrast, brandColor } = useFormContext()

  return (
    <>
      {!hideLabel && <Label htmlFor={id}>{label}</Label>}
      <Container
        error={error}
        shape={shape}
        size={size}
        contrast={contrast}
        brandColor={brandColor}
      >
        <span>{value === '' ? '-' : value}</span>
        <Select {...restOfProps} aria-label={label} ref={ref} id={id} value={value}>
          <option value="">-</option>
          {tableColumn.options.map(option => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </Select>
      </Container>
    </>
  )
})

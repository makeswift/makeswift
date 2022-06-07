import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules } from '../../../../../../../../utils/cssMediaRules'
import { useFormContext, Sizes, Contrasts, Value } from '../../../../../../context/FormContext'
import cssField, {
  getSizeHeight,
  getSizeHorizontalPadding,
  getContrastColor,
} from '../../../../services/cssField'
import Label from '../../../Label'

const Container = styled.div.withConfig({
  shouldForwardProp: prop =>
    !['error', 'shape', 'size', 'contrast', 'brandColor'].includes(prop.toString()),
})<Value & { error?: boolean }>`
  ${cssField()}
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  border-color: #f19eb9;

  &:focus,
  &:focus-within {
    border-color: #e54e7f;
  }

  ${props =>
    cssMediaRules(
      [props.size, props.contrast] as const,
      ([size = Sizes.MEDIUM, contrast = Contrasts.LIGHT]) => css`
        min-height: ${getSizeHeight(size)}px;
        max-height: ${getSizeHeight(size)}px;

        &::after {
          content: '';
          position: absolute;
          right: ${getSizeHorizontalPadding(size)}px;
          top: 50%;
          transform: translate3d(0, -25%, 0);
          border: solid 0.35em transparent;
          border-top-color: ${getContrastColor(contrast)};
        }
      `,
    )}
`

const Select = styled.select`
  appearance: none;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
`

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

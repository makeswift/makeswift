import styled, { css } from 'styled-components'

import { useFormContext, Sizes, Shapes, Value } from '../../../../context/FormContext'
import { getSizeHeight as getLabelSizeHeight } from '../Label'
import { getSizeHeight as getInputSizeHeight } from '../Input'
import { getShapeBorderRadius } from '../../services/cssField'
import { cssMediaRules } from '../../../../../../utils/cssMediaRules'

const Label = styled.div.withConfig({
  shouldForwardProp: prop => !['size'].includes(prop.toString()),
})<Pick<Value, 'size'>>`
  display: block;
  max-width: 120px;
  min-width: 60px;
  border-radius: 2px;
  background-color: #5f49f4;
  opacity: 0.4;
  ${props =>
    cssMediaRules(
      [props.size] as const,
      ([size = Sizes.MEDIUM]) => css`
        margin: calc(0.25 * ${getLabelSizeHeight(size)}px + 2px) 0;
        min-height: ${0.5 * getLabelSizeHeight(size)}px;
        max-height: ${0.5 * getLabelSizeHeight(size)}px;
      `,
    )}
`

const Input = styled.div.withConfig({
  shouldForwardProp: prop => !['shape', 'size'].includes(prop.toString()),
})<Pick<Value, 'shape' | 'size'>>`
  display: block;
  width: 100%;
  border-width: 2px;
  border-style: solid;
  border-color: #5f49f4;
  opacity: 0.4;
  ${props =>
    cssMediaRules(
      [props.shape, props.size] as const,
      ([shape = Shapes.ROUNDED, size = Sizes.MEDIUM]) => css`
        min-height: ${getInputSizeHeight(size)}px;
        max-height: ${getInputSizeHeight(size)}px;
        border-radius: ${getShapeBorderRadius(shape)}px;
      `,
    )}
`

export default function PlaceholderTableField(): JSX.Element {
  const { size, shape } = useFormContext()

  return (
    <>
      <Label size={size} />
      <Input shape={shape} size={size} />
    </>
  )
}

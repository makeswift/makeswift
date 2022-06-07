import { forwardRef, CSSProperties, ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'
import Color from 'color'

import { getSizeHeight as getSize } from '../Label'
import { useFormContext, Sizes, Contrasts, Value } from '../../../../context/FormContext'
import { getContrastBorderColor, getContrastBackgroundColor } from '../../services/cssField'
import { cssMediaRules } from '../../../../../../utils/cssMediaRules'
import { colorToString } from '../../../../../../utils/colorToString'
import { ColorValue } from '../../../../../../utils/types'

function getCheckmarkColor({
  swatch: { hue: h, saturation: s, lightness: l } = { hue: 0, saturation: 0, lightness: 0 },
  alpha: a,
}: ColorValue) {
  return Color({ h, s, l }).alpha(a).isLight() ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)'
}

const Container = styled.div.withConfig({
  shouldForwardProp: prop => !['size'].includes(prop.toString()),
})<Pick<Value, 'size'>>`
  position: relative;
  ${props =>
    cssMediaRules(
      [props.size],
      ([size = Sizes.MEDIUM]) => css`
        height: ${getSize(size)}px;
        width: ${getSize(size)}px;
      `,
    )}
`

const FakeRadioButton = styled.div.withConfig({
  shouldForwardProp: prop => !['contrast', 'error'].includes(prop.toString()),
})<Pick<Value, 'contrast'> & { error?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-radius: 50%;
  pointer-events: none;
  border-width: 1px;
  ${props =>
    cssMediaRules(
      [props.contrast],
      ([contrast = Contrasts.LIGHT]) => css`
        border-color: ${getContrastBorderColor(contrast, props.error)};
        background-color: ${getContrastBackgroundColor(contrast)};
      `,
    )}
`

const HiddenRadioButton = styled.input
  .withConfig({
    shouldForwardProp: prop => !['brandColor', 'contrast', 'error'].includes(prop.toString()),
  })
  .attrs({ type: 'radio' })<Pick<Value, 'brandColor' | 'contrast'> & { error?: boolean }>`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &:disabled {
    cursor: no-drop;

    & ~ ${FakeRadioButton} {
      opacity: 0.5;
    }
  }

  &:checked ~ ${FakeRadioButton} {
    ${props =>
      cssMediaRules(
        [props.brandColor] as const,
        ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
          background-color: ${colorToString(brandColor)};
        `,
      )}
    border-color: transparent;

    &::after {
      content: '';
      position: absolute;
      box-sizing: content-box;
      top: 50%;
      left: 50%;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      ${props =>
        cssMediaRules(
          [props.brandColor] as const,
          ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
            background-color: ${getCheckmarkColor(brandColor)};
          `,
        )}
    }
  }

  &:not(:disabled) {
    &:focus ~ ${FakeRadioButton} {
      ${props =>
        cssMediaRules(
          [props.brandColor] as const,
          ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
            border-color: ${colorToString(brandColor)};
          `,
        )}
    }
  }

  &:not(:disabled):checked {
    &:focus ~ ${FakeRadioButton} {
      ${props =>
        cssMediaRules(
          [props.contrast] as const,
          ([contrast = Contrasts.LIGHT]) => css`
            border-color: ${getContrastBorderColor(contrast, props.error)};
          `,
        )}
    }
  }
`

type BaseProps = {
  error?: boolean
  className?: string
  style?: CSSProperties
  form?: unknown
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof HiddenRadioButton>, keyof BaseProps>

export default forwardRef<HTMLInputElement, Props>(function RadioButton(
  { error, className, style, form, ...restOfProps }: Props,
  ref,
) {
  const { size, contrast, brandColor } = useFormContext()

  return (
    <Container size={size}>
      <HiddenRadioButton
        {...restOfProps}
        ref={ref}
        error={error}
        contrast={contrast}
        brandColor={brandColor}
      />
      <FakeRadioButton className={className} error={error} contrast={contrast} style={style} />
    </Container>
  )
})

import { forwardRef, CSSProperties, ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'
import Color from 'color'

import { getSizeHeight as getSize } from '../Label'
import {
  useFormContext,
  Value as FormContextValue,
  Sizes,
  Contrasts,
} from '../../../../context/FormContext'
import { getContrastBorderColor, getContrastBackgroundColor } from '../../services/cssField'
import { cssMediaRules } from '../../../../../../utils/cssMediaRules'
import { colorToString } from '../../../../../../utils/colorToString'
import { SwatchValue } from '../../../../../../utils/types'

function getCheckmarkColor({
  swatch: { hue: h, saturation: s, lightness: l },
  alpha: a,
}: {
  swatch: SwatchValue
  alpha: number
}) {
  return Color({ h, s, l }).alpha(a).isLight() ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)'
}

const Container = styled.div<Pick<FormContextValue, 'size'>>`
  position: relative;
  ${props =>
    cssMediaRules(
      [props.size] as const,
      ([size = Sizes.MEDIUM]) => css`
        height: ${getSize(size)}px;
        width: ${getSize(size)}px;
      `,
    )}
`

const FakeCheckbox = styled.div<Pick<FormContextValue, 'contrast'> & { error?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-radius: 4px;
  pointer-events: none;
  border-width: 1px;
  ${props =>
    cssMediaRules(
      [props.contrast] as const,
      ([contrast = Contrasts.LIGHT]) => css`
        border-color: ${getContrastBorderColor(contrast, props.error)};
        background-color: ${getContrastBackgroundColor(contrast)};
      `,
    )}
`

const HiddenCheckbox = styled.input<
  Pick<FormContextValue, 'size' | 'brandColor' | 'contrast'> & {
    error?: boolean
  }
>`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &:disabled {
    cursor: no-drop;

    & ~ ${FakeCheckbox} {
      opacity: 0.5;
    }
  }

  &:checked ~ ${FakeCheckbox} {
    ${props =>
      cssMediaRules(
        [props.brandColor] as const,
        ([{ swatch = { hue: 0, saturation: 0, lightness: 0 }, alpha = 1 } = {}]) => css`
          background-color: ${colorToString({ swatch, alpha })};
        `,
      )}
    border-color: transparent;

    &::after {
      content: '';
      position: absolute;
      box-sizing: content-box;
      width: 25%;
      height: 50%;
      ${props =>
        cssMediaRules(
          [props.size] as const,
          ([size = Sizes.MEDIUM]) => css`
            border-width: ${getSize(size) * 0.1}px;
            border-left: 0;
            border-top: 0;
          `,
        )}
      border-style: solid;
      ${props =>
        cssMediaRules(
          [props.brandColor] as const,
          ([{ swatch = { hue: 0, saturation: 0, lightness: 0 }, alpha = 1 } = {}]) => css`
            border-color: ${getCheckmarkColor({ swatch, alpha })};
          `,
        )}
      transform: rotate(45deg) translate3d(91%, -23%, 0);
    }
  }

  &:not(:disabled) {
    &:focus ~ ${FakeCheckbox} {
      ${props =>
        cssMediaRules(
          [props.brandColor],
          ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => css`
            border-color: ${colorToString(brandColor)};
          `,
        )}
    }
  }

  &:not(:disabled):checked {
    &:focus ~ ${FakeCheckbox} {
      ${props =>
        cssMediaRules(
          [props.contrast],
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

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof HiddenCheckbox>, keyof BaseProps>

export default forwardRef<HTMLInputElement, Props>(function Checkbox(
  { error, className, style, form, ...restOfProps }: Props,
  ref,
) {
  const { size, contrast, brandColor } = useFormContext()

  return (
    <Container size={size}>
      <HiddenCheckbox
        {...restOfProps}
        type="checkbox"
        ref={ref}
        error={error}
        // @ts-expect-error: HTMLInputElement `size` attribute conflicts with prop
        size={size}
        contrast={contrast}
        brandColor={brandColor}
      />
      <FakeCheckbox className={className} error={error} contrast={contrast} style={style} />
    </Container>
  )
})

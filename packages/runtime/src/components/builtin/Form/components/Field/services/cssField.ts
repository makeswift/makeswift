import { css } from 'styled-components'

import { cssMediaRules } from '../../../../../utils/cssMediaRules'
import { colorToString } from '../../../../../utils/colorToString'

import {
  Size,
  Shape,
  Contrast,
  Shapes,
  Sizes,
  Contrasts,
  Value,
} from '../../../context/FormContext'

export function getSizeHeight(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 30

    case Sizes.MEDIUM:
      return 38

    case Sizes.LARGE:
      return 48

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

export function getSizeHorizontalPadding(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 8

    case Sizes.MEDIUM:
      return 12

    case Sizes.LARGE:
      return 16

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

function getSizeVerticalPadding(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 3

    case Sizes.MEDIUM:
      return 7

    case Sizes.LARGE:
      return 11

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

export function getShapeBorderRadius(shape: Shape): number {
  switch (shape) {
    case Shapes.SQUARE:
      return 0

    case Shapes.ROUNDED:
      return 4

    case Shapes.PILL:
      return 500

    default:
      throw new Error(`Invalid form shape "${shape}"`)
  }
}

export function getContrastBorderColor(contrast: Contrast, error?: boolean): string {
  switch (contrast) {
    case Contrasts.LIGHT:
      return error ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.25)'

    case Contrasts.DARK:
      return error ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.6)'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

export function getContrastBackgroundColor(contrast: Contrast): string {
  switch (contrast) {
    case Contrasts.LIGHT:
      return 'white'

    case Contrasts.DARK:
      return 'rgba(0, 0, 0, 0.7)'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

export function getContrastColor(contrast: Contrast): string {
  switch (contrast) {
    case Contrasts.LIGHT:
      return 'rgba(0, 0, 0, 0.95)'

    case Contrasts.DARK:
      return 'white'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

function getContrastPlaceholderColor(contrast: Contrast) {
  switch (contrast) {
    case Contrasts.LIGHT:
      return 'rgba(0, 0, 0, 0.3)'

    case Contrasts.DARK:
      return 'rgba(255,255,255,0.3)'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

export default function cssField() {
  return css<Pick<Value, 'shape' | 'size' | 'contrast' | 'brandColor'> & { error?: boolean }>`
    display: block;
    width: 100%;
    outline: none;
    border-width: 1px;
    border-style: solid;
    transition: border-color 200ms;
    ${props =>
      cssMediaRules(
        [props.shape, props.size, props.contrast, props.brandColor] as const,
        ([
          shape = Shapes.ROUNDED,
          size = Sizes.MEDIUM,
          contrast = Contrasts.LIGHT,
          brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
        ]) => css`
          padding: ${getSizeVerticalPadding(size)}px ${getSizeHorizontalPadding(size)}px;
          border-radius: ${getShapeBorderRadius(shape)}px;
          border-color: ${getContrastBorderColor(contrast, props.error)};
          color: ${getContrastColor(contrast)};
          background-color: ${getContrastBackgroundColor(contrast)};

          :focus,
          :focus-within {
            border-color: ${colorToString(brandColor)};
          }

          ::placeholder {
            color: ${getContrastPlaceholderColor(contrast)};
          }
        `,
      )}
  `
}

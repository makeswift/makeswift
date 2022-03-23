import { createContext, useContext } from 'react'

import {
  ResponsiveValue,
  ResponsiveColorValue,
  TextStyleValue,
} from '../../../../prop-controllers/descriptors'
import { ColorValue } from '../../../utils/types'

export const Shapes = Object.freeze({
  SQUARE: 'square',
  ROUNDED: 'rounded',
  PILL: 'pill',
} as const)

export type Shape = typeof Shapes[keyof typeof Shapes]

export const Sizes = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const)

export type Size = typeof Sizes[keyof typeof Sizes]

export const Contrasts = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
} as const)

export type Contrast = typeof Contrasts[keyof typeof Contrasts]

export type Value = {
  shape: ResponsiveValue<Shape> | null | undefined
  size: ResponsiveValue<Size> | null | undefined
  contrast: ResponsiveValue<Contrast> | null | undefined
  brandColor: ResponsiveValue<ColorValue> | null | undefined
  labelTextStyle?: TextStyleValue
  labelTextColor?: ResponsiveColorValue
}

const Context = createContext<Value>({} as Value)

export function useFormContext(): Value {
  return useContext(Context)
}

const { Provider } = Context

export { Provider }

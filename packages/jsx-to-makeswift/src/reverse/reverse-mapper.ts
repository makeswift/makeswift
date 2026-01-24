/**
 * @fileoverview Reverse mapping from CSS values to Tailwind classes.
 *
 * This module provides functions to convert CSS property values back to
 * their corresponding Tailwind utility classes.
 */

import type { DeviceId } from '../types'

type TailwindClass = string

type ReverseMapResult = {
  classes: TailwindClass[]
  unmapped: string[]
}

const DEVICE_TO_PREFIX: Record<DeviceId, string> = {
  mobile: '',
  tablet: 'sm:',
  desktop: 'lg:',
}

const SPACING_SCALE: Record<string, string> = {
  '0': '0',
  '0.25rem': '1',
  '0.5rem': '2',
  '0.75rem': '3',
  '1rem': '4',
  '1.25rem': '5',
  '1.5rem': '6',
  '1.75rem': '7',
  '2rem': '8',
  '2.25rem': '9',
  '2.5rem': '10',
  '2.75rem': '11',
  '3rem': '12',
  '3.5rem': '14',
  '4rem': '16',
  '5rem': '20',
  '6rem': '24',
  '7rem': '28',
  '8rem': '32',
  '9rem': '36',
  '10rem': '40',
  '11rem': '44',
  '12rem': '48',
  '13rem': '52',
  '14rem': '56',
  '15rem': '60',
  '16rem': '64',
  '18rem': '72',
  '20rem': '80',
  '24rem': '96',
  'auto': 'auto',
}

const FONT_SIZE_SCALE: Record<string, string> = {
  '0.75rem': 'xs',
  '0.875rem': 'sm',
  '1rem': 'base',
  '1.125rem': 'lg',
  '1.25rem': 'xl',
  '1.5rem': '2xl',
  '1.875rem': '3xl',
  '2.25rem': '4xl',
  '3rem': '5xl',
  '3.75rem': '6xl',
  '4.5rem': '7xl',
  '6rem': '8xl',
  '8rem': '9xl',
}

const FONT_WEIGHT_SCALE: Record<number, string> = {
  100: 'thin',
  200: 'extralight',
  300: 'light',
  400: 'normal',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
  900: 'black',
}

const LINE_HEIGHT_SCALE: Record<string, string> = {
  '1': 'none',
  '1.25': 'tight',
  '1.375': 'snug',
  '1.5': 'normal',
  '1.625': 'relaxed',
  '2': 'loose',
}

const BORDER_RADIUS_SCALE: Record<string, string> = {
  '0': 'none',
  '0.125rem': 'sm',
  '0.25rem': 'DEFAULT',
  '0.375rem': 'md',
  '0.5rem': 'lg',
  '0.75rem': 'xl',
  '1rem': '2xl',
  '1.5rem': '3xl',
  '9999px': 'full',
}

const WIDTH_SCALE: Record<string, string> = {
  '0': '0',
  'auto': 'auto',
  '100%': 'full',
  '100vw': 'screen',
  '50%': '1/2',
  '33.333333%': '1/3',
  '66.666667%': '2/3',
  '25%': '1/4',
  '75%': '3/4',
  '20%': '1/5',
  '40%': '2/5',
  '60%': '3/5',
  '80%': '4/5',
  ...Object.fromEntries(
    Object.entries(SPACING_SCALE).filter(([k]) => k !== 'auto'),
  ),
}

const HEIGHT_SCALE: Record<string, string> = {
  '0': '0',
  'auto': 'auto',
  '100%': 'full',
  '100vh': 'screen',
  ...Object.fromEntries(
    Object.entries(SPACING_SCALE).filter(([k]) => k !== 'auto'),
  ),
}

const COLOR_HEX_TO_NAME: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
  '#f9fafb': 'gray-50',
  '#f3f4f6': 'gray-100',
  '#e5e7eb': 'gray-200',
  '#d1d5db': 'gray-300',
  '#9ca3af': 'gray-400',
  '#6b7280': 'gray-500',
  '#4b5563': 'gray-600',
  '#374151': 'gray-700',
  '#1f2937': 'gray-800',
  '#111827': 'gray-900',
  '#fef2f2': 'red-50',
  '#fee2e2': 'red-100',
  '#fecaca': 'red-200',
  '#fca5a5': 'red-300',
  '#f87171': 'red-400',
  '#ef4444': 'red-500',
  '#dc2626': 'red-600',
  '#b91c1c': 'red-700',
  '#991b1b': 'red-800',
  '#7f1d1d': 'red-900',
  '#eff6ff': 'blue-50',
  '#dbeafe': 'blue-100',
  '#bfdbfe': 'blue-200',
  '#93c5fd': 'blue-300',
  '#60a5fa': 'blue-400',
  '#3b82f6': 'blue-500',
  '#2563eb': 'blue-600',
  '#1d4ed8': 'blue-700',
  '#1e40af': 'blue-800',
  '#1e3a8a': 'blue-900',
  '#f0fdf4': 'green-50',
  '#dcfce7': 'green-100',
  '#bbf7d0': 'green-200',
  '#86efac': 'green-300',
  '#4ade80': 'green-400',
  '#22c55e': 'green-500',
  '#16a34a': 'green-600',
  '#15803d': 'green-700',
  '#166534': 'green-800',
  '#14532d': 'green-900',
  '#fefce8': 'yellow-50',
  '#fef9c3': 'yellow-100',
  '#fef08a': 'yellow-200',
  '#fde047': 'yellow-300',
  '#facc15': 'yellow-400',
  '#eab308': 'yellow-500',
  '#ca8a04': 'yellow-600',
  '#a16207': 'yellow-700',
  '#854d0e': 'yellow-800',
  '#713f12': 'yellow-900',
  '#fdf4ff': 'purple-50',
  '#fae8ff': 'purple-100',
  '#f5d0fe': 'purple-200',
  '#f0abfc': 'purple-300',
  '#e879f9': 'purple-400',
  '#d946ef': 'purple-500',
  '#c026d3': 'purple-600',
  '#a21caf': 'purple-700',
  '#86198f': 'purple-800',
  '#701a75': 'purple-900',
  '#fff7ed': 'orange-50',
  '#ffedd5': 'orange-100',
  '#fed7aa': 'orange-200',
  '#fdba74': 'orange-300',
  '#fb923c': 'orange-400',
  '#f97316': 'orange-500',
  '#ea580c': 'orange-600',
  '#c2410c': 'orange-700',
  '#9a3412': 'orange-800',
  '#7c2d12': 'orange-900',
}

const DISPLAY_VALUES: Record<string, string> = {
  block: 'block',
  'inline-block': 'inline-block',
  inline: 'inline',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  none: 'hidden',
}

const FLEX_DIRECTION_VALUES: Record<string, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
}

const JUSTIFY_CONTENT_VALUES: Record<string, string> = {
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  center: 'justify-center',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
}

const ALIGN_ITEMS_VALUES: Record<string, string> = {
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const POSITION_VALUES: Record<string, string> = {
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  relative: 'relative',
  sticky: 'sticky',
}

const TEXT_ALIGN_VALUES: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

function createArbitraryClass(prefix: string, value: string): string {
  const cleanPrefix = prefix.endsWith('-') ? prefix.slice(0, -1) : prefix
  return `${cleanPrefix}-[${value}]`
}

function mapSpacingValue(
  value: string,
  prefix: string,
): TailwindClass | null {
  const scale = SPACING_SCALE[value]
  if (scale) {
    return `${prefix}${scale}`
  }
  return createArbitraryClass(prefix, value)
}

function mapMargin(
  styles: Record<string, string | number>,
): ReverseMapResult {
  const classes: TailwindClass[] = []
  const unmapped: string[] = []

  const margin = styles.margin?.toString()
  const mt = styles.marginTop?.toString()
  const mr = styles.marginRight?.toString()
  const mb = styles.marginBottom?.toString()
  const ml = styles.marginLeft?.toString()

  if (margin) {
    const cls = mapSpacingValue(margin, 'm-')
    if (cls) classes.push(cls)
  } else {
    if (mt) {
      const cls = mapSpacingValue(mt, 'mt-')
      if (cls) classes.push(cls)
    }
    if (mr) {
      const cls = mapSpacingValue(mr, 'mr-')
      if (cls) classes.push(cls)
    }
    if (mb) {
      const cls = mapSpacingValue(mb, 'mb-')
      if (cls) classes.push(cls)
    }
    if (ml) {
      const cls = mapSpacingValue(ml, 'ml-')
      if (cls) classes.push(cls)
    }
  }

  return { classes, unmapped }
}

function mapPadding(
  styles: Record<string, string | number>,
): ReverseMapResult {
  const classes: TailwindClass[] = []
  const unmapped: string[] = []

  const padding = styles.padding?.toString()
  const pt = styles.paddingTop?.toString()
  const pr = styles.paddingRight?.toString()
  const pb = styles.paddingBottom?.toString()
  const pl = styles.paddingLeft?.toString()

  if (padding) {
    const cls = mapSpacingValue(padding, 'p-')
    if (cls) classes.push(cls)
  } else {
    if (pt) {
      const cls = mapSpacingValue(pt, 'pt-')
      if (cls) classes.push(cls)
    }
    if (pr) {
      const cls = mapSpacingValue(pr, 'pr-')
      if (cls) classes.push(cls)
    }
    if (pb) {
      const cls = mapSpacingValue(pb, 'pb-')
      if (cls) classes.push(cls)
    }
    if (pl) {
      const cls = mapSpacingValue(pl, 'pl-')
      if (cls) classes.push(cls)
    }
  }

  return { classes, unmapped }
}

function mapWidth(value: string): TailwindClass | null {
  const scale = WIDTH_SCALE[value]
  if (scale) {
    return scale === '0' ? 'w-0' : `w-${scale}`
  }
  return createArbitraryClass('w', value)
}

function mapHeight(value: string): TailwindClass | null {
  const scale = HEIGHT_SCALE[value]
  if (scale) {
    return scale === '0' ? 'h-0' : `h-${scale}`
  }
  return createArbitraryClass('h', value)
}

function mapGap(value: string): TailwindClass | null {
  const scale = SPACING_SCALE[value]
  if (scale) {
    return `gap-${scale}`
  }
  return createArbitraryClass('gap', value)
}

function mapBorderRadius(value: string): TailwindClass | null {
  const scale = BORDER_RADIUS_SCALE[value]
  if (scale) {
    return scale === 'DEFAULT' ? 'rounded' : `rounded-${scale}`
  }
  return createArbitraryClass('rounded', value)
}

function mapColor(
  hex: string,
  property: 'textColor' | 'backgroundColor' | 'borderColor',
): TailwindClass | null {
  const colorName = COLOR_HEX_TO_NAME[hex.toLowerCase()]
  const prefix =
    property === 'textColor'
      ? 'text'
      : property === 'backgroundColor'
        ? 'bg'
        : 'border'

  if (colorName) {
    return `${prefix}-${colorName}`
  }
  return createArbitraryClass(prefix, hex)
}

function mapFontSize(value: string): TailwindClass | null {
  const scale = FONT_SIZE_SCALE[value]
  if (scale) {
    return `text-${scale}`
  }
  return createArbitraryClass('text', value)
}

function mapFontWeight(value: number): TailwindClass | null {
  const scale = FONT_WEIGHT_SCALE[value]
  if (scale) {
    return `font-${scale}`
  }
  return createArbitraryClass('font', value.toString())
}

function mapLineHeight(value: string): TailwindClass | null {
  const scale = LINE_HEIGHT_SCALE[value]
  if (scale) {
    return `leading-${scale}`
  }
  return createArbitraryClass('leading', value)
}

/**
 * Maps a Style control value to Tailwind classes.
 */
export function mapStyleToClasses(
  styles: Record<string, string | number>,
): ReverseMapResult {
  const classes: TailwindClass[] = []
  const unmapped: string[] = []

  const marginResult = mapMargin(styles)
  classes.push(...marginResult.classes)
  unmapped.push(...marginResult.unmapped)

  const paddingResult = mapPadding(styles)
  classes.push(...paddingResult.classes)
  unmapped.push(...paddingResult.unmapped)

  if (styles.width) {
    const cls = mapWidth(styles.width.toString())
    if (cls) classes.push(cls)
  }

  if (styles.height) {
    const cls = mapHeight(styles.height.toString())
    if (cls) classes.push(cls)
  }

  if (styles.gap) {
    const cls = mapGap(styles.gap.toString())
    if (cls) classes.push(cls)
  }

  if (styles.borderRadius) {
    const cls = mapBorderRadius(styles.borderRadius.toString())
    if (cls) classes.push(cls)
  }

  if (styles.display) {
    const cls = DISPLAY_VALUES[styles.display.toString()]
    if (cls) classes.push(cls)
  }

  if (styles.flexDirection) {
    const cls = FLEX_DIRECTION_VALUES[styles.flexDirection.toString()]
    if (cls) classes.push(cls)
  }

  if (styles.justifyContent) {
    const cls = JUSTIFY_CONTENT_VALUES[styles.justifyContent.toString()]
    if (cls) classes.push(cls)
  }

  if (styles.alignItems) {
    const cls = ALIGN_ITEMS_VALUES[styles.alignItems.toString()]
    if (cls) classes.push(cls)
  }

  if (styles.position) {
    const cls = POSITION_VALUES[styles.position.toString()]
    if (cls) classes.push(cls)
  }

  return { classes, unmapped }
}

/**
 * Maps a Color control value to a Tailwind class.
 */
export function mapColorToClass(
  color: string,
  property: 'textColor' | 'backgroundColor' | 'borderColor',
): TailwindClass | null {
  return mapColor(color, property)
}

/**
 * Maps a Typography control value to Tailwind classes.
 */
export function mapTypographyToClasses(typography: {
  fontSize?: string
  fontWeight?: number
  lineHeight?: string
  textAlign?: string
  fontStyle?: string
  textDecoration?: string
  textTransform?: string
  letterSpacing?: string
}): ReverseMapResult {
  const classes: TailwindClass[] = []
  const unmapped: string[] = []

  if (typography.fontSize) {
    const cls = mapFontSize(typography.fontSize)
    if (cls) classes.push(cls)
  }

  if (typography.fontWeight) {
    const cls = mapFontWeight(typography.fontWeight)
    if (cls) classes.push(cls)
  }

  if (typography.lineHeight) {
    const cls = mapLineHeight(typography.lineHeight)
    if (cls) classes.push(cls)
  }

  if (typography.textAlign) {
    const cls = TEXT_ALIGN_VALUES[typography.textAlign]
    if (cls) classes.push(cls)
  }

  if (typography.fontStyle === 'italic') {
    classes.push('italic')
  }

  if (typography.textDecoration === 'underline') {
    classes.push('underline')
  } else if (typography.textDecoration === 'line-through') {
    classes.push('line-through')
  }

  if (typography.textTransform === 'uppercase') {
    classes.push('uppercase')
  } else if (typography.textTransform === 'lowercase') {
    classes.push('lowercase')
  } else if (typography.textTransform === 'capitalize') {
    classes.push('capitalize')
  }

  return { classes, unmapped }
}

/**
 * Adds a responsive prefix to a class based on device ID.
 */
export function addResponsivePrefix(
  cls: TailwindClass,
  deviceId: DeviceId,
): TailwindClass {
  const prefix = DEVICE_TO_PREFIX[deviceId]
  return `${prefix}${cls}`
}

/**
 * Gets the responsive prefix for a device ID.
 */
export function getResponsivePrefix(deviceId: DeviceId): string {
  return DEVICE_TO_PREFIX[deviceId]
}

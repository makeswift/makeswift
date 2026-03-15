import type { TailwindClassToken } from '../../types'

const SIZE_SCALE: Record<string, string> = {
  '0': '0px',
  px: '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
  auto: 'auto',
  full: '100%',
  screen: '100vw',
  svw: '100svw',
  lvw: '100lvw',
  dvw: '100dvw',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
}

const WIDTH_FRACTIONS: Record<string, string> = {
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
}

const HEIGHT_SCREEN_VALUES: Record<string, string> = {
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
}

type SizingResult = {
  property: string
  value: string
} | null

function resolveSizeValue(
  value: string | null,
  isArbitrary: boolean,
  includeFractions = true,
): string | null {
  if (!value) return null

  if (isArbitrary) {
    return value
  }

  if (SIZE_SCALE[value]) {
    return SIZE_SCALE[value]
  }

  if (includeFractions && WIDTH_FRACTIONS[value]) {
    return WIDTH_FRACTIONS[value]
  }

  if (HEIGHT_SCREEN_VALUES[value]) {
    return HEIGHT_SCREEN_VALUES[value]
  }

  return null
}

export function resolveWidth(token: TailwindClassToken): SizingResult {
  const value = resolveSizeValue(token.value, token.isArbitrary)
  if (!value) return null

  switch (token.utility) {
    case 'w':
      return { property: 'width', value }
    case 'min-w':
      return { property: 'minWidth', value }
    case 'max-w':
      return resolveMaxWidth(token)
    default:
      return null
  }
}

function resolveMaxWidth(token: TailwindClassToken): SizingResult {
  const maxWidthScale: Record<string, string> = {
    '0': '0rem',
    none: 'none',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    prose: '65ch',
    'screen-sm': '640px',
    'screen-md': '768px',
    'screen-lg': '1024px',
    'screen-xl': '1280px',
    'screen-2xl': '1536px',
  }

  if (token.isArbitrary && token.value) {
    return { property: 'maxWidth', value: token.value }
  }

  const value = token.value ? maxWidthScale[token.value] : null
  if (!value) return null

  return { property: 'maxWidth', value }
}

export function resolveHeight(token: TailwindClassToken): SizingResult {
  const value = resolveSizeValue(token.value, token.isArbitrary, false)
  if (!value) return null

  switch (token.utility) {
    case 'h':
      return { property: 'height', value }
    case 'min-h':
      return { property: 'minHeight', value }
    case 'max-h':
      return { property: 'maxHeight', value }
    default:
      return null
  }
}

export function resolveSize(token: TailwindClassToken): SizingResult {
  const value = resolveSizeValue(token.value, token.isArbitrary)
  if (!value) return null

  if (token.utility === 'size') {
    return { property: 'size', value }
  }

  return null
}

const WIDTH_UTILITIES = ['w', 'min-w', 'max-w']
const HEIGHT_UTILITIES = ['h', 'min-h', 'max-h']
const SIZE_UTILITIES = ['size']

export function isSizingUtility(utility: string): boolean {
  return (
    WIDTH_UTILITIES.includes(utility) ||
    HEIGHT_UTILITIES.includes(utility) ||
    SIZE_UTILITIES.includes(utility)
  )
}

export function resolveSizing(token: TailwindClassToken): SizingResult {
  if (WIDTH_UTILITIES.includes(token.utility)) {
    return resolveWidth(token)
  }

  if (HEIGHT_UTILITIES.includes(token.utility)) {
    return resolveHeight(token)
  }

  if (SIZE_UTILITIES.includes(token.utility)) {
    return resolveSize(token)
  }

  return null
}

import type { TailwindClassToken } from '../../types'

const SPACING_SCALE: Record<string, string> = {
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
}

type SpacingResult = {
  property: string
  value: string
} | null

export function resolveSpacingValue(value: string | null, isArbitrary: boolean): string | null {
  if (!value) return null

  if (isArbitrary) {
    return value
  }

  return SPACING_SCALE[value] ?? null
}

export function resolveMargin(token: TailwindClassToken): SpacingResult {
  const value = resolveSpacingValue(token.value, token.isArbitrary)
  if (!value) return null

  const sign = token.isNegative ? '-' : ''
  const finalValue = `${sign}${value}`

  switch (token.utility) {
    case 'm':
      return { property: 'margin', value: finalValue }
    case 'mx':
      return { property: 'marginInline', value: finalValue }
    case 'my':
      return { property: 'marginBlock', value: finalValue }
    case 'mt':
      return { property: 'marginTop', value: finalValue }
    case 'mr':
      return { property: 'marginRight', value: finalValue }
    case 'mb':
      return { property: 'marginBottom', value: finalValue }
    case 'ml':
      return { property: 'marginLeft', value: finalValue }
    case 'ms':
      return { property: 'marginInlineStart', value: finalValue }
    case 'me':
      return { property: 'marginInlineEnd', value: finalValue }
    default:
      return null
  }
}

export function resolvePadding(token: TailwindClassToken): SpacingResult {
  const value = resolveSpacingValue(token.value, token.isArbitrary)
  if (!value) return null

  switch (token.utility) {
    case 'p':
      return { property: 'padding', value }
    case 'px':
      return { property: 'paddingInline', value }
    case 'py':
      return { property: 'paddingBlock', value }
    case 'pt':
      return { property: 'paddingTop', value }
    case 'pr':
      return { property: 'paddingRight', value }
    case 'pb':
      return { property: 'paddingBottom', value }
    case 'pl':
      return { property: 'paddingLeft', value }
    case 'ps':
      return { property: 'paddingInlineStart', value }
    case 'pe':
      return { property: 'paddingInlineEnd', value }
    default:
      return null
  }
}

export function resolveGap(token: TailwindClassToken): SpacingResult {
  const value = resolveSpacingValue(token.value, token.isArbitrary)
  if (!value) return null

  switch (token.utility) {
    case 'gap':
      return { property: 'gap', value }
    case 'gap-x':
      return { property: 'columnGap', value }
    case 'gap-y':
      return { property: 'rowGap', value }
    default:
      return null
  }
}

export function resolveSpaceUtility(token: TailwindClassToken): SpacingResult {
  const value = resolveSpacingValue(token.value, token.isArbitrary)
  if (!value) return null

  const sign = token.isNegative ? '-' : ''
  const finalValue = `${sign}${value}`

  switch (token.utility) {
    case 'space-x':
      return { property: '--tw-space-x', value: finalValue }
    case 'space-y':
      return { property: '--tw-space-y', value: finalValue }
    default:
      return null
  }
}

const MARGIN_UTILITIES = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me']
const PADDING_UTILITIES = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe']
const GAP_UTILITIES = ['gap', 'gap-x', 'gap-y']
const SPACE_UTILITIES = ['space-x', 'space-y']

export function isSpacingUtility(utility: string): boolean {
  return (
    MARGIN_UTILITIES.includes(utility) ||
    PADDING_UTILITIES.includes(utility) ||
    GAP_UTILITIES.includes(utility) ||
    SPACE_UTILITIES.includes(utility)
  )
}

export function resolveSpacing(
  token: TailwindClassToken,
): SpacingResult {
  if (MARGIN_UTILITIES.includes(token.utility)) {
    return resolveMargin(token)
  }

  if (PADDING_UTILITIES.includes(token.utility)) {
    return resolvePadding(token)
  }

  if (GAP_UTILITIES.includes(token.utility)) {
    return resolveGap(token)
  }

  if (SPACE_UTILITIES.includes(token.utility)) {
    return resolveSpaceUtility(token)
  }

  return null
}

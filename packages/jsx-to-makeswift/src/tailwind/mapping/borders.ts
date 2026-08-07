import type { TailwindClassToken } from '../../types'

type BorderResult = {
  property: string
  value: string
} | null

const BORDER_WIDTH_SCALE: Record<string, string> = {
  '': '1px',
  '0': '0px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
}

const BORDER_RADIUS_SCALE: Record<string, string> = {
  none: '0px',
  sm: '0.125rem',
  '': '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

const BORDER_STYLE_VALUES: Record<string, string> = {
  'border-solid': 'solid',
  'border-dashed': 'dashed',
  'border-dotted': 'dotted',
  'border-double': 'double',
  'border-hidden': 'hidden',
  'border-none': 'none',
}

const SHADOW_SCALE: Record<string, string> = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
}

const OPACITY_SCALE: Record<string, string> = {
  '0': '0',
  '5': '0.05',
  '10': '0.1',
  '15': '0.15',
  '20': '0.2',
  '25': '0.25',
  '30': '0.3',
  '35': '0.35',
  '40': '0.4',
  '45': '0.45',
  '50': '0.5',
  '55': '0.55',
  '60': '0.6',
  '65': '0.65',
  '70': '0.7',
  '75': '0.75',
  '80': '0.8',
  '85': '0.85',
  '90': '0.9',
  '95': '0.95',
  '100': '1',
}

export function resolveBorderWidth(token: TailwindClassToken): BorderResult {
  if (!token.utility.startsWith('border')) return null

  if (token.isArbitrary && token.value) {
    return { property: 'borderWidth', value: token.value }
  }

  const sides: Record<string, string> = {
    'border-t': 'borderTopWidth',
    'border-r': 'borderRightWidth',
    'border-b': 'borderBottomWidth',
    'border-l': 'borderLeftWidth',
    'border-x': 'borderInlineWidth',
    'border-y': 'borderBlockWidth',
  }

  if (token.utility === 'border') {
    const width = BORDER_WIDTH_SCALE[token.value ?? '']
    if (width) {
      return { property: 'borderWidth', value: width }
    }
  }

  const sideProperty = sides[token.utility]
  if (sideProperty) {
    const width = BORDER_WIDTH_SCALE[token.value ?? '']
    if (width) {
      return { property: sideProperty, value: width }
    }
  }

  return null
}

export function resolveBorderRadius(token: TailwindClassToken): BorderResult {
  if (!token.utility.startsWith('rounded')) return null

  if (token.isArbitrary && token.value) {
    return { property: 'borderRadius', value: token.value }
  }

  const corners: Record<string, string> = {
    'rounded-t': 'borderTopRadius',
    'rounded-r': 'borderRightRadius',
    'rounded-b': 'borderBottomRadius',
    'rounded-l': 'borderLeftRadius',
    'rounded-tl': 'borderTopLeftRadius',
    'rounded-tr': 'borderTopRightRadius',
    'rounded-br': 'borderBottomRightRadius',
    'rounded-bl': 'borderBottomLeftRadius',
    'rounded-s': 'borderStartRadius',
    'rounded-e': 'borderEndRadius',
    'rounded-ss': 'borderStartStartRadius',
    'rounded-se': 'borderStartEndRadius',
    'rounded-ee': 'borderEndEndRadius',
    'rounded-es': 'borderEndStartRadius',
  }

  if (token.utility === 'rounded') {
    const radius = BORDER_RADIUS_SCALE[token.value ?? '']
    if (radius) {
      return { property: 'borderRadius', value: radius }
    }
  }

  const cornerProperty = corners[token.utility]
  if (cornerProperty) {
    const radius = BORDER_RADIUS_SCALE[token.value ?? '']
    if (radius) {
      return { property: cornerProperty, value: radius }
    }
  }

  return null
}

export function resolveBorderStyle(token: TailwindClassToken): BorderResult {
  const value = BORDER_STYLE_VALUES[token.utility]
  if (value) {
    return { property: 'borderStyle', value }
  }
  return null
}

export function resolveShadow(token: TailwindClassToken): BorderResult {
  if (token.utility !== 'shadow') return null

  if (token.isArbitrary && token.value) {
    return { property: 'boxShadow', value: token.value }
  }

  const shadow = SHADOW_SCALE[token.value ?? '']
  if (shadow) {
    return { property: 'boxShadow', value: shadow }
  }

  return null
}

export function resolveOpacity(token: TailwindClassToken): BorderResult {
  if (token.utility !== 'opacity') return null

  if (token.isArbitrary && token.value) {
    return { property: 'opacity', value: token.value }
  }

  if (!token.value) return null

  const opacity = OPACITY_SCALE[token.value]
  if (opacity) {
    return { property: 'opacity', value: opacity }
  }

  return null
}

export function resolveRing(token: TailwindClassToken): BorderResult {
  if (token.utility !== 'ring') return null

  const ringWidths: Record<string, string> = {
    '': '3px',
    '0': '0px',
    '1': '1px',
    '2': '2px',
    '4': '4px',
    '8': '8px',
    inset: 'inset',
  }

  if (token.isArbitrary && token.value) {
    return { property: '--tw-ring-width', value: token.value }
  }

  const width = ringWidths[token.value ?? '']
  if (width) {
    return { property: '--tw-ring-width', value: width }
  }

  return null
}

const BORDER_UTILITIES = [
  'border',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-x',
  'border-y',
  'rounded',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-tl',
  'rounded-tr',
  'rounded-br',
  'rounded-bl',
  'rounded-s',
  'rounded-e',
  'rounded-ss',
  'rounded-se',
  'rounded-ee',
  'rounded-es',
  'border-solid',
  'border-dashed',
  'border-dotted',
  'border-double',
  'border-hidden',
  'border-none',
  'shadow',
  'opacity',
  'ring',
]

export function isBorderUtility(utility: string): boolean {
  return BORDER_UTILITIES.includes(utility)
}

export function resolveBorder(token: TailwindClassToken): BorderResult {
  return (
    resolveBorderWidth(token) ??
    resolveBorderRadius(token) ??
    resolveBorderStyle(token) ??
    resolveShadow(token) ??
    resolveOpacity(token) ??
    resolveRing(token)
  )
}

export { BORDER_RADIUS_SCALE, SHADOW_SCALE }

import type { TailwindClassToken } from '../../types'

const FONT_SIZE_SCALE: Record<string, { fontSize: string; lineHeight: string }> = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  base: { fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { fontSize: '3rem', lineHeight: '1' },
  '6xl': { fontSize: '3.75rem', lineHeight: '1' },
  '7xl': { fontSize: '4.5rem', lineHeight: '1' },
  '8xl': { fontSize: '6rem', lineHeight: '1' },
  '9xl': { fontSize: '8rem', lineHeight: '1' },
}

const FONT_WEIGHT_SCALE: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}

const LINE_HEIGHT_SCALE: Record<string, string> = {
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
}

const LETTER_SPACING_SCALE: Record<string, string> = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

const FONT_FAMILY_SCALE: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

type TypographyResult = {
  property: string
  value: string | number
} | null

export function resolveFontSize(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'text') return null

  if (token.isArbitrary && token.value) {
    return { property: 'fontSize', value: token.value }
  }

  if (!token.value) return null

  const sizeData = FONT_SIZE_SCALE[token.value]
  if (sizeData) {
    return { property: 'fontSize', value: sizeData.fontSize }
  }

  return null
}

export function resolveFontWeight(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'font') return null

  if (token.isArbitrary && token.value) {
    const numValue = parseInt(token.value, 10)
    if (!isNaN(numValue)) {
      return { property: 'fontWeight', value: numValue }
    }
  }

  if (!token.value) return null

  const weight = FONT_WEIGHT_SCALE[token.value]
  if (weight !== undefined) {
    return { property: 'fontWeight', value: weight }
  }

  return null
}

export function resolveFontFamily(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'font') return null

  if (token.isArbitrary && token.value) {
    return { property: 'fontFamily', value: token.value }
  }

  if (!token.value) return null

  const family = FONT_FAMILY_SCALE[token.value]
  if (family) {
    return { property: 'fontFamily', value: family }
  }

  return null
}

export function resolveLineHeight(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'leading') return null

  if (token.isArbitrary && token.value) {
    return { property: 'lineHeight', value: token.value }
  }

  if (!token.value) return null

  const lineHeight = LINE_HEIGHT_SCALE[token.value]
  if (lineHeight) {
    return { property: 'lineHeight', value: lineHeight }
  }

  return null
}

export function resolveLetterSpacing(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'tracking') return null

  if (token.isArbitrary && token.value) {
    return { property: 'letterSpacing', value: token.value }
  }

  if (!token.value) return null

  const spacing = LETTER_SPACING_SCALE[token.value]
  if (spacing) {
    return { property: 'letterSpacing', value: spacing }
  }

  return null
}

export function resolveTextAlign(token: TailwindClassToken): TypographyResult {
  if (token.utility !== 'text') return null

  const alignments = ['left', 'center', 'right', 'justify', 'start', 'end']
  if (token.value && alignments.includes(token.value)) {
    return { property: 'textAlign', value: token.value }
  }

  return null
}

export function resolveTextTransform(token: TailwindClassToken): TypographyResult {
  const transforms: Record<string, string> = {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    'normal-case': 'none',
  }

  const value = transforms[token.utility]
  if (value) {
    return { property: 'textTransform', value }
  }

  return null
}

export function resolveTextDecoration(token: TailwindClassToken): TypographyResult {
  const decorations: Record<string, string> = {
    underline: 'underline',
    overline: 'overline',
    'line-through': 'line-through',
    'no-underline': 'none',
  }

  const value = decorations[token.utility]
  if (value) {
    return { property: 'textDecoration', value }
  }

  return null
}

export function resolveFontStyle(token: TailwindClassToken): TypographyResult {
  if (token.utility === 'italic') {
    return { property: 'fontStyle', value: 'italic' }
  }

  if (token.utility === 'not-italic') {
    return { property: 'fontStyle', value: 'normal' }
  }

  return null
}

const TYPOGRAPHY_UTILITIES = [
  'text',
  'font',
  'leading',
  'tracking',
  'uppercase',
  'lowercase',
  'capitalize',
  'normal-case',
  'underline',
  'overline',
  'line-through',
  'no-underline',
  'italic',
  'not-italic',
]

export function isTypographyUtility(utility: string): boolean {
  return TYPOGRAPHY_UTILITIES.includes(utility)
}

export function resolveTypography(
  token: TailwindClassToken,
): TypographyResult {
  const fontSize = resolveFontSize(token)
  if (fontSize) return fontSize

  const fontWeight = resolveFontWeight(token)
  if (fontWeight) return fontWeight

  const fontFamily = resolveFontFamily(token)
  if (fontFamily) return fontFamily

  const lineHeight = resolveLineHeight(token)
  if (lineHeight) return lineHeight

  const letterSpacing = resolveLetterSpacing(token)
  if (letterSpacing) return letterSpacing

  const textAlign = resolveTextAlign(token)
  if (textAlign) return textAlign

  const textTransform = resolveTextTransform(token)
  if (textTransform) return textTransform

  const textDecoration = resolveTextDecoration(token)
  if (textDecoration) return textDecoration

  const fontStyle = resolveFontStyle(token)
  if (fontStyle) return fontStyle

  return null
}

export { FONT_SIZE_SCALE, FONT_WEIGHT_SCALE, LINE_HEIGHT_SCALE, LETTER_SPACING_SCALE }

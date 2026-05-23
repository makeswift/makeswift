import type { TailwindClassToken } from '../../types'

import { isBorderUtility, resolveBorder } from './borders'
import { isColorUtility, resolveColor } from './colors'
import { isLayoutUtility, resolveLayout } from './layout'
import { isSizingUtility, resolveSizing } from './sizing'
import { isSpacingUtility, resolveSpacing } from './spacing'
import { isTypographyUtility, resolveTypography } from './typography'

export * from './spacing'
export * from './sizing'
export * from './colors'
export * from './typography'
export * from './layout'
export * from './borders'

export type ResolvedCSSProperty = {
  property: string
  value: string | number
  category: 'spacing' | 'sizing' | 'color' | 'typography' | 'layout' | 'border'
  colorName?: string
  colorShade?: string | null
}

export type ResolutionResult = {
  resolved: ResolvedCSSProperty[]
  unresolved: TailwindClassToken[]
}

export function resolveToken(token: TailwindClassToken): ResolvedCSSProperty | null {
  if (isSpacingUtility(token.utility)) {
    const result = resolveSpacing(token)
    if (result) {
      return { ...result, category: 'spacing' }
    }
  }

  if (isSizingUtility(token.utility)) {
    const result = resolveSizing(token)
    if (result) {
      return { ...result, category: 'sizing' }
    }
  }

  if (isColorUtility(token)) {
    const result = resolveColor(token)
    if (result) {
      return {
        property: result.property,
        value: result.value,
        category: 'color',
        colorName: result.colorName,
        colorShade: result.shade,
      }
    }
  }

  if (isTypographyUtility(token.utility)) {
    const result = resolveTypography(token)
    if (result) {
      return { ...result, category: 'typography' }
    }
  }

  if (isLayoutUtility(token.utility)) {
    const result = resolveLayout(token)
    if (result) {
      return { ...result, category: 'layout' }
    }
  }

  if (isBorderUtility(token.utility)) {
    const result = resolveBorder(token)
    if (result) {
      return { ...result, category: 'border' }
    }
  }

  return null
}

export function resolveTokens(tokens: TailwindClassToken[]): ResolutionResult {
  const resolved: ResolvedCSSProperty[] = []
  const unresolved: TailwindClassToken[] = []

  for (const token of tokens) {
    const result = resolveToken(token)
    if (result) {
      resolved.push(result)
    } else {
      unresolved.push(token)
    }
  }

  return { resolved, unresolved }
}

export function groupByCategory(
  properties: ResolvedCSSProperty[],
): Record<ResolvedCSSProperty['category'], ResolvedCSSProperty[]> {
  const groups: Record<ResolvedCSSProperty['category'], ResolvedCSSProperty[]> = {
    spacing: [],
    sizing: [],
    color: [],
    typography: [],
    layout: [],
    border: [],
  }

  for (const prop of properties) {
    groups[prop.category].push(prop)
  }

  return groups
}

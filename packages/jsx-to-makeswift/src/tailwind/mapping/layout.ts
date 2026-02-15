import type { TailwindClassToken } from '../../types'

type LayoutResult = {
  property: string
  value: string
} | null

const DISPLAY_VALUES: Record<string, string> = {
  block: 'block',
  'inline-block': 'inline-block',
  inline: 'inline',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  table: 'table',
  'inline-table': 'inline-table',
  'table-caption': 'table-caption',
  'table-cell': 'table-cell',
  'table-column': 'table-column',
  'table-column-group': 'table-column-group',
  'table-footer-group': 'table-footer-group',
  'table-header-group': 'table-header-group',
  'table-row-group': 'table-row-group',
  'table-row': 'table-row',
  'flow-root': 'flow-root',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  contents: 'contents',
  'list-item': 'list-item',
  hidden: 'none',
}

const POSITION_VALUES: Record<string, string> = {
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  relative: 'relative',
  sticky: 'sticky',
}

const FLEX_DIRECTION_VALUES: Record<string, string> = {
  'flex-row': 'row',
  'flex-row-reverse': 'row-reverse',
  'flex-col': 'column',
  'flex-col-reverse': 'column-reverse',
}

const FLEX_WRAP_VALUES: Record<string, string> = {
  'flex-wrap': 'wrap',
  'flex-wrap-reverse': 'wrap-reverse',
  'flex-nowrap': 'nowrap',
}

const JUSTIFY_CONTENT_VALUES: Record<string, string> = {
  'justify-normal': 'normal',
  'justify-start': 'flex-start',
  'justify-end': 'flex-end',
  'justify-center': 'center',
  'justify-between': 'space-between',
  'justify-around': 'space-around',
  'justify-evenly': 'space-evenly',
  'justify-stretch': 'stretch',
}

const ALIGN_ITEMS_VALUES: Record<string, string> = {
  'items-start': 'flex-start',
  'items-end': 'flex-end',
  'items-center': 'center',
  'items-baseline': 'baseline',
  'items-stretch': 'stretch',
}

const ALIGN_SELF_VALUES: Record<string, string> = {
  'self-auto': 'auto',
  'self-start': 'flex-start',
  'self-end': 'flex-end',
  'self-center': 'center',
  'self-stretch': 'stretch',
  'self-baseline': 'baseline',
}

const ALIGN_CONTENT_VALUES: Record<string, string> = {
  'content-normal': 'normal',
  'content-center': 'center',
  'content-start': 'flex-start',
  'content-end': 'flex-end',
  'content-between': 'space-between',
  'content-around': 'space-around',
  'content-evenly': 'space-evenly',
  'content-baseline': 'baseline',
  'content-stretch': 'stretch',
}

const OVERFLOW_VALUES: Record<string, string> = {
  'overflow-auto': 'auto',
  'overflow-hidden': 'hidden',
  'overflow-clip': 'clip',
  'overflow-visible': 'visible',
  'overflow-scroll': 'scroll',
  'overflow-x-auto': 'auto',
  'overflow-y-auto': 'auto',
  'overflow-x-hidden': 'hidden',
  'overflow-y-hidden': 'hidden',
  'overflow-x-clip': 'clip',
  'overflow-y-clip': 'clip',
  'overflow-x-visible': 'visible',
  'overflow-y-visible': 'visible',
  'overflow-x-scroll': 'scroll',
  'overflow-y-scroll': 'scroll',
}

const Z_INDEX_SCALE: Record<string, string> = {
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  auto: 'auto',
}

export function resolveDisplay(token: TailwindClassToken): LayoutResult {
  const value = DISPLAY_VALUES[token.utility]
  if (value) {
    return { property: 'display', value }
  }
  return null
}

export function resolvePosition(token: TailwindClassToken): LayoutResult {
  const value = POSITION_VALUES[token.utility]
  if (value) {
    return { property: 'position', value }
  }
  return null
}

export function resolveFlexDirection(token: TailwindClassToken): LayoutResult {
  const value = FLEX_DIRECTION_VALUES[token.utility]
  if (value) {
    return { property: 'flexDirection', value }
  }
  return null
}

export function resolveFlexWrap(token: TailwindClassToken): LayoutResult {
  const value = FLEX_WRAP_VALUES[token.utility]
  if (value) {
    return { property: 'flexWrap', value }
  }
  return null
}

export function resolveJustifyContent(token: TailwindClassToken): LayoutResult {
  const value = JUSTIFY_CONTENT_VALUES[token.utility]
  if (value) {
    return { property: 'justifyContent', value }
  }
  return null
}

export function resolveAlignItems(token: TailwindClassToken): LayoutResult {
  const value = ALIGN_ITEMS_VALUES[token.utility]
  if (value) {
    return { property: 'alignItems', value }
  }
  return null
}

export function resolveAlignSelf(token: TailwindClassToken): LayoutResult {
  const value = ALIGN_SELF_VALUES[token.utility]
  if (value) {
    return { property: 'alignSelf', value }
  }
  return null
}

export function resolveAlignContent(token: TailwindClassToken): LayoutResult {
  const value = ALIGN_CONTENT_VALUES[token.utility]
  if (value) {
    return { property: 'alignContent', value }
  }
  return null
}

export function resolveOverflow(token: TailwindClassToken): LayoutResult {
  const value = OVERFLOW_VALUES[token.utility]
  if (value) {
    const property = token.utility.includes('-x')
      ? 'overflowX'
      : token.utility.includes('-y')
        ? 'overflowY'
        : 'overflow'
    return { property, value }
  }
  return null
}

export function resolveZIndex(token: TailwindClassToken): LayoutResult {
  if (token.utility !== 'z') return null

  if (token.isArbitrary && token.value) {
    return { property: 'zIndex', value: token.value }
  }

  if (!token.value) return null

  const value = Z_INDEX_SCALE[token.value]
  if (value) {
    return { property: 'zIndex', value }
  }

  return null
}

export function resolveFlexGrow(token: TailwindClassToken): LayoutResult {
  if (token.utility === 'grow') {
    return { property: 'flexGrow', value: token.value ?? '1' }
  }
  if (token.utility === 'grow-0') {
    return { property: 'flexGrow', value: '0' }
  }
  return null
}

export function resolveFlexShrink(token: TailwindClassToken): LayoutResult {
  if (token.utility === 'shrink') {
    return { property: 'flexShrink', value: token.value ?? '1' }
  }
  if (token.utility === 'shrink-0') {
    return { property: 'flexShrink', value: '0' }
  }
  return null
}

export function resolveOrder(token: TailwindClassToken): LayoutResult {
  if (token.utility !== 'order') return null

  const orderValues: Record<string, string> = {
    first: '-9999',
    last: '9999',
    none: '0',
  }

  if (token.isArbitrary && token.value) {
    return { property: 'order', value: token.value }
  }

  if (!token.value) return null

  const value = orderValues[token.value] ?? token.value
  return { property: 'order', value }
}

const LAYOUT_UTILITIES = [
  ...Object.keys(DISPLAY_VALUES),
  ...Object.keys(POSITION_VALUES),
  ...Object.keys(FLEX_DIRECTION_VALUES),
  ...Object.keys(FLEX_WRAP_VALUES),
  ...Object.keys(JUSTIFY_CONTENT_VALUES),
  ...Object.keys(ALIGN_ITEMS_VALUES),
  ...Object.keys(ALIGN_SELF_VALUES),
  ...Object.keys(ALIGN_CONTENT_VALUES),
  ...Object.keys(OVERFLOW_VALUES),
  'z',
  'grow',
  'grow-0',
  'shrink',
  'shrink-0',
  'order',
]

export function isLayoutUtility(utility: string): boolean {
  return LAYOUT_UTILITIES.includes(utility)
}

export function resolveLayout(token: TailwindClassToken): LayoutResult {
  return (
    resolveDisplay(token) ??
    resolvePosition(token) ??
    resolveFlexDirection(token) ??
    resolveFlexWrap(token) ??
    resolveJustifyContent(token) ??
    resolveAlignItems(token) ??
    resolveAlignSelf(token) ??
    resolveAlignContent(token) ??
    resolveOverflow(token) ??
    resolveZIndex(token) ??
    resolveFlexGrow(token) ??
    resolveFlexShrink(token) ??
    resolveOrder(token)
  )
}

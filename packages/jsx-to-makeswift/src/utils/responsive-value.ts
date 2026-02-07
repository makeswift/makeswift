import type {
  DeviceId,
  DeviceOverride,
  ResponsiveValue,
  TailwindClassToken,
  TailwindParseResult,
} from '../types'

import {
  groupByCategory,
  resolveTokens,
  type ResolvedCSSProperty,
} from '../tailwind/mapping'

const DEVICE_ORDER: DeviceId[] = [
  'mobile',
  'tablet',
  'desktop',
]

const BREAKPOINT_PRIORITY: Record<string, number> = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 5,
}

function sortTokensByBreakpointPriority(
  tokens: TailwindClassToken[],
): TailwindClassToken[] {
  return [...tokens].sort((a, b) => {
    const priorityA = a.prefix ? (BREAKPOINT_PRIORITY[a.prefix] ?? 0) : 0
    const priorityB = b.prefix ? (BREAKPOINT_PRIORITY[b.prefix] ?? 0) : 0
    return priorityA - priorityB
  })
}

export type ResponsiveStyleValue = ResponsiveValue<Record<string, string | number>>

export type ResponsiveColorValue = ResponsiveValue<{
  color: string
  alpha: number
  colorName?: string
  colorShade?: string | null
}>

export type ResponsiveTypographyValue = ResponsiveValue<{
  fontFamily?: string
  fontSize?: string
  fontWeight?: number
  lineHeight?: string
  letterSpacing?: string
  textAlign?: string
  textTransform?: string
  textDecoration?: string
  fontStyle?: string
}>

type CategorizedResponsiveValues = {
  style: ResponsiveStyleValue
  colors: {
    textColor?: ResponsiveColorValue
    backgroundColor?: ResponsiveColorValue
    borderColor?: ResponsiveColorValue
  }
  typography: ResponsiveTypographyValue
}

function propertiesToRecord(
  properties: ResolvedCSSProperty[],
): Record<string, string | number> {
  const result: Record<string, string | number> = {}

  for (const prop of properties) {
    result[prop.property] = prop.value
  }

  return result
}

function propertiesToTypography(
  properties: ResolvedCSSProperty[],
): ResponsiveTypographyValue[number]['value'] {
  const result: ResponsiveTypographyValue[number]['value'] = {}

  for (const prop of properties) {
    switch (prop.property) {
      case 'fontFamily':
        result.fontFamily = String(prop.value)
        break
      case 'fontSize':
        result.fontSize = String(prop.value)
        break
      case 'fontWeight':
        result.fontWeight = Number(prop.value)
        break
      case 'lineHeight':
        result.lineHeight = String(prop.value)
        break
      case 'letterSpacing':
        result.letterSpacing = String(prop.value)
        break
      case 'textAlign':
        result.textAlign = String(prop.value)
        break
      case 'textTransform':
        result.textTransform = String(prop.value)
        break
      case 'textDecoration':
        result.textDecoration = String(prop.value)
        break
      case 'fontStyle':
        result.fontStyle = String(prop.value)
        break
    }
  }

  return result
}

export function buildResponsiveValues(
  parseResult: TailwindParseResult,
): CategorizedResponsiveValues {
  const style: ResponsiveStyleValue = []
  const colors: CategorizedResponsiveValues['colors'] = {}
  const typography: ResponsiveTypographyValue = []

  const baseResolution = resolveTokens(parseResult.baseClasses)
  const baseGrouped = groupByCategory(baseResolution.resolved)

  const baseStyleProps = [
    ...baseGrouped.spacing,
    ...baseGrouped.sizing,
    ...baseGrouped.layout,
    ...baseGrouped.border,
  ]

  if (baseStyleProps.length > 0) {
    style.push({
      deviceId: 'mobile',
      value: propertiesToRecord(baseStyleProps),
    })
  }

  for (const colorProp of baseGrouped.color) {
    const colorValue = {
      color: String(colorProp.value),
      alpha: 1,
      colorName: colorProp.colorName,
      colorShade: colorProp.colorShade,
    }

    switch (colorProp.property) {
      case 'color':
        if (!colors.textColor) colors.textColor = []
        colors.textColor.push({ deviceId: 'mobile', value: colorValue })
        break
      case 'backgroundColor':
        if (!colors.backgroundColor) colors.backgroundColor = []
        colors.backgroundColor.push({ deviceId: 'mobile', value: colorValue })
        break
      case 'borderColor':
        if (!colors.borderColor) colors.borderColor = []
        colors.borderColor.push({ deviceId: 'mobile', value: colorValue })
        break
    }
  }

  if (baseGrouped.typography.length > 0) {
    typography.push({
      deviceId: 'mobile',
      value: propertiesToTypography(baseGrouped.typography),
    })
  }

  for (const deviceId of DEVICE_ORDER) {
    if (deviceId === 'mobile') continue

    const deviceTokens = parseResult.responsiveClasses[deviceId]
    if (deviceTokens.length === 0) continue

    const sortedTokens = sortTokensByBreakpointPriority(deviceTokens)

    const deviceResolution = resolveTokens(sortedTokens)
    const deviceGrouped = groupByCategory(deviceResolution.resolved)

    const deviceStyleProps = [
      ...deviceGrouped.spacing,
      ...deviceGrouped.sizing,
      ...deviceGrouped.layout,
      ...deviceGrouped.border,
    ]

    if (deviceStyleProps.length > 0) {
      style.push({
        deviceId,
        value: propertiesToRecord(deviceStyleProps),
      })
    }

    const deviceColors: Record<string, { color: string; alpha: number; colorName?: string; colorShade?: string | null }> = {}

    for (const colorProp of deviceGrouped.color) {
      deviceColors[colorProp.property] = {
        color: String(colorProp.value),
        alpha: 1,
        colorName: colorProp.colorName,
        colorShade: colorProp.colorShade,
      }
    }

    if (deviceColors['color']) {
      if (!colors.textColor) colors.textColor = []
      colors.textColor.push({ deviceId, value: deviceColors['color'] })
    }
    if (deviceColors['backgroundColor']) {
      if (!colors.backgroundColor) colors.backgroundColor = []
      colors.backgroundColor.push({ deviceId, value: deviceColors['backgroundColor'] })
    }
    if (deviceColors['borderColor']) {
      if (!colors.borderColor) colors.borderColor = []
      colors.borderColor.push({ deviceId, value: deviceColors['borderColor'] })
    }

    if (deviceGrouped.typography.length > 0) {
      typography.push({
        deviceId,
        value: propertiesToTypography(deviceGrouped.typography),
      })
    }
  }

  return { style, colors, typography }
}

export function mergeResponsiveValues<T>(
  base: ResponsiveValue<T>,
  override: ResponsiveValue<T>,
  merger: (a: T, b: T) => T,
): ResponsiveValue<T> {
  const result: ResponsiveValue<T> = [...base]

  for (const overrideItem of override) {
    const existingIndex = result.findIndex(
      (item) => item.deviceId === overrideItem.deviceId,
    )

    if (existingIndex >= 0) {
      result[existingIndex] = {
        deviceId: overrideItem.deviceId,
        value: merger(result[existingIndex].value, overrideItem.value),
      }
    } else {
      result.push(overrideItem)
    }
  }

  return result.sort(
    (a, b) => DEVICE_ORDER.indexOf(a.deviceId) - DEVICE_ORDER.indexOf(b.deviceId),
  )
}

export function getValueForDevice<T>(
  responsiveValue: ResponsiveValue<T>,
  deviceId: DeviceId,
): T | undefined {
  const deviceIndex = DEVICE_ORDER.indexOf(deviceId)

  for (let i = deviceIndex; i >= 0; i--) {
    const device = DEVICE_ORDER[i]
    const value = responsiveValue.find((v) => v.deviceId === device)
    if (value) return value.value
  }

  return undefined
}

export function hasResponsiveValues<T>(value: ResponsiveValue<T>): boolean {
  return value.length > 1
}

export function createDeviceOverride<T>(
  deviceId: DeviceId,
  value: T,
): DeviceOverride<T> {
  return { deviceId, value }
}

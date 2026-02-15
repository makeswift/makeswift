/**
 * @fileoverview Types for Makeswift runtime schema format.
 *
 * This module defines the types for the actual Makeswift page data structure,
 * which is different from the ElementSchema format used by transformJSX.
 */

export type MakeswiftDeviceValue<T> = {
  deviceId: 'desktop' | 'mobile' | 'tablet'
  value: T
}

export type MakeswiftSizeValue = {
  value: number
  unit: 'px' | '%' | 'em' | 'rem' | 'vw' | 'vh'
}

export type MakeswiftPaddingValue = {
  paddingTop?: MakeswiftSizeValue | number
  paddingRight?: MakeswiftSizeValue | number
  paddingBottom?: MakeswiftSizeValue | number
  paddingLeft?: MakeswiftSizeValue | number
}

export type MakeswiftMarginValue = {
  marginTop?: MakeswiftSizeValue | 'auto' | number
  marginRight?: MakeswiftSizeValue | 'auto' | number
  marginBottom?: MakeswiftSizeValue | 'auto' | number
  marginLeft?: MakeswiftSizeValue | 'auto' | number
}

export type MakeswiftTypographyStyle = {
  fontFamily?: string | null
  fontSize?: MakeswiftSizeValue
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: MakeswiftSizeValue | null
  textTransform?: string[]
  fontStyle?: string[]
}

export type MakeswiftTextNode = {
  text: string
  typography?: {
    style: MakeswiftDeviceValue<MakeswiftTypographyStyle>[]
  }
}

export type MakeswiftTextDescendant = {
  type: 'default' | string
  children: MakeswiftTextNode[]
  textAlign?: MakeswiftDeviceValue<string>[]
}

export type MakeswiftRichTextV2 = {
  type: 'makeswift::controls::rich-text-v2'
  version: 2
  descendants: MakeswiftTextDescendant[]
  key: string
}

export type MakeswiftLink = {
  type: 'OPEN_URL' | 'OPEN_PAGE' | string
  payload: {
    url?: string
    openInNewTab?: boolean
    pageId?: string
  }
}

export type MakeswiftColumns = {
  spans: number[][]
  count: number
}

export type MakeswiftChildren = {
  elements: MakeswiftElement[]
  columns?: MakeswiftDeviceValue<MakeswiftColumns>[]
}

export type MakeswiftElementProps = {
  padding?: MakeswiftDeviceValue<MakeswiftPaddingValue>[]
  margin?: MakeswiftDeviceValue<MakeswiftMarginValue>[]
  width?: MakeswiftDeviceValue<MakeswiftSizeValue>[]
  height?: MakeswiftDeviceValue<MakeswiftSizeValue>[]
  rowGap?: MakeswiftDeviceValue<MakeswiftSizeValue>[]
  columnGap?: MakeswiftDeviceValue<MakeswiftSizeValue>[]
  children?: MakeswiftChildren | string
  text?: MakeswiftRichTextV2
  image?: string
  alt?: string
  link?: MakeswiftLink
  variant?: MakeswiftDeviceValue<string>[]
  shape?: MakeswiftDeviceValue<string>[]
  textStyle?: MakeswiftDeviceValue<MakeswiftTypographyStyle>[]
  [key: string]: unknown
}

export type MakeswiftElement = {
  key: string
  type: string
  props: MakeswiftElementProps
}

export type MakeswiftRuntimeSchema = MakeswiftElement

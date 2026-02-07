import type {
  ColorControlValue,
  ControlValue,
  ImageControlValue,
  LinkControlValue,
  ParsedJSXElement,
  RichTextControlValue,
  SlotControlValue,
  StyleControlValue,
  StyleProperty,
  TextAreaControlValue,
  TextInputControlValue,
  TypographyControlValue,
} from '../types'

import { tokenizeTailwindClasses } from '../tailwind/tokenizer'
import {
  buildResponsiveValues,
  type ResponsiveColorValue,
  type ResponsiveStyleValue,
  type ResponsiveTypographyValue,
} from '../utils/responsive-value'

import { inferContentControlType, inferElementType } from './type-inference'

type ControlMappingResult = {
  controls: Record<string, ControlValue>
  unmappedClasses: string[]
}

const CSS_TO_STYLE_PROPERTY: Record<string, StyleProperty> = {
  margin: 'margin',
  marginTop: 'marginTop',
  marginRight: 'marginRight',
  marginBottom: 'marginBottom',
  marginLeft: 'marginLeft',
  marginInline: 'marginLeft',
  marginBlock: 'marginTop',
  marginInlineStart: 'marginLeft',
  marginInlineEnd: 'marginRight',
  padding: 'padding',
  paddingTop: 'paddingTop',
  paddingRight: 'paddingRight',
  paddingBottom: 'paddingBottom',
  paddingLeft: 'paddingLeft',
  paddingInline: 'paddingLeft',
  paddingBlock: 'paddingTop',
  paddingInlineStart: 'paddingLeft',
  paddingInlineEnd: 'paddingRight',
  width: 'width',
  height: 'height',
  minWidth: 'minWidth',
  minHeight: 'minHeight',
  maxWidth: 'maxWidth',
  maxHeight: 'maxHeight',
  gap: 'gap',
  rowGap: 'rowGap',
  columnGap: 'columnGap',
  display: 'display',
  flexDirection: 'flexDirection',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
  flexWrap: 'flexWrap',
  position: 'position',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  zIndex: 'zIndex',
  overflow: 'overflow',
  borderWidth: 'borderWidth',
  borderRadius: 'borderRadius',
  borderStyle: 'borderStyle',
  boxShadow: 'boxShadow',
  opacity: 'opacity',
}

function extractStyleProperties(
  styleValue: ResponsiveStyleValue,
): StyleProperty[] {
  const properties = new Set<StyleProperty>()

  for (const device of styleValue) {
    for (const cssProp of Object.keys(device.value)) {
      const styleProp = CSS_TO_STYLE_PROPERTY[cssProp]
      if (styleProp) {
        properties.add(styleProp)
      }
    }
  }

  return Array.from(properties)
}

function createStyleControl(
  styleValue: ResponsiveStyleValue,
): StyleControlValue | null {
  if (styleValue.length === 0) return null

  const properties = extractStyleProperties(styleValue)
  if (properties.length === 0) return null

  return {
    type: 'Style',
    properties,
    value: styleValue,
  }
}

function createColorControl(
  colorValue: ResponsiveColorValue,
  property: 'textColor' | 'backgroundColor' | 'borderColor',
): ColorControlValue | null {
  if (colorValue.length === 0) return null

  return {
    type: 'Color',
    property,
    value: colorValue,
  }
}

function createTypographyControl(
  typographyValue: ResponsiveTypographyValue,
): TypographyControlValue | null {
  if (typographyValue.length === 0) return null

  const hasValues = typographyValue.some(
    (device) => Object.keys(device.value).length > 0,
  )

  if (!hasValues) return null

  return {
    type: 'Typography',
    value: typographyValue,
  }
}

function createTextInputControl(value: string): TextInputControlValue {
  return {
    type: 'TextInput',
    value,
  }
}

function createTextAreaControl(value: string): TextAreaControlValue {
  return {
    type: 'TextArea',
    value,
  }
}

function createRichTextControl(value: string): RichTextControlValue {
  return {
    type: 'RichText',
    value,
  }
}

type ImageAttributes = {
  src?: string
  alt?: string
  width?: number | string
  height?: number | string
}

function createImageControl(attributes: ImageAttributes): ImageControlValue | null {
  const src = attributes.src

  if (!src || src === '[dynamic]') {
    return null
  }

  const result: ImageControlValue = {
    type: 'Image',
    value: {
      src,
    },
  }

  if (attributes.alt && attributes.alt !== '[dynamic]') {
    result.value.alt = String(attributes.alt)
  }

  if (attributes.width !== undefined && attributes.width !== '[dynamic]') {
    const width = typeof attributes.width === 'number'
      ? attributes.width
      : parseInt(String(attributes.width), 10)

    if (!isNaN(width)) {
      result.value.width = width
    }
  }

  if (attributes.height !== undefined && attributes.height !== '[dynamic]') {
    const height = typeof attributes.height === 'number'
      ? attributes.height
      : parseInt(String(attributes.height), 10)

    if (!isNaN(height)) {
      result.value.height = height
    }
  }

  return result
}

type LinkAttributes = {
  href?: string
  target?: string
}

function createLinkControl(attributes: LinkAttributes): LinkControlValue | null {
  const href = attributes.href

  if (!href || href === '[dynamic]') {
    return null
  }

  const result: LinkControlValue = {
    type: 'Link',
    value: {
      href,
    },
  }

  if (attributes.target && attributes.target !== '[dynamic]') {
    result.value.target = String(attributes.target)
  }

  return result
}

function isImageElement(tagName: string): boolean {
  return tagName.toLowerCase() === 'img'
}

function isLinkElement(tagName: string): boolean {
  return tagName.toLowerCase() === 'a'
}

function isVideoElement(tagName: string): boolean {
  return tagName.toLowerCase() === 'video'
}

function isButtonElement(tagName: string): boolean {
  return tagName.toLowerCase() === 'button'
}

export function mapElementToControls(
  element: ParsedJSXElement,
): ControlMappingResult {
  const controls: Record<string, ControlValue> = {}
  const unmappedClasses: string[] = []

  const parseResult = tokenizeTailwindClasses(element.className)
  const responsiveValues = buildResponsiveValues(parseResult)

  const styleControl = createStyleControl(responsiveValues.style)
  if (styleControl) {
    controls.style = styleControl
  }

  if (responsiveValues.colors.textColor) {
    const textColorControl = createColorControl(
      responsiveValues.colors.textColor,
      'textColor',
    )
    if (textColorControl) {
      controls.textColor = textColorControl
    }
  }

  if (responsiveValues.colors.backgroundColor) {
    const bgColorControl = createColorControl(
      responsiveValues.colors.backgroundColor,
      'backgroundColor',
    )
    if (bgColorControl) {
      controls.backgroundColor = bgColorControl
    }
  }

  if (responsiveValues.colors.borderColor) {
    const borderColorControl = createColorControl(
      responsiveValues.colors.borderColor,
      'borderColor',
    )
    if (borderColorControl) {
      controls.borderColor = borderColorControl
    }
  }

  const typographyControl = createTypographyControl(responsiveValues.typography)
  if (typographyControl) {
    controls.typography = typographyControl
  }

  if (isImageElement(element.tagName)) {
    const imageControl = createImageControl(element.attributes as ImageAttributes)
    if (imageControl) {
      controls.image = imageControl
    }
  }

  if (isLinkElement(element.tagName)) {
    const linkControl = createLinkControl(element.attributes as LinkAttributes)
    if (linkControl) {
      controls.link = linkControl
    }

    if (element.textContent) {
      controls.content = createTextInputControl(element.textContent)
    }
  } else if (isButtonElement(element.tagName)) {
    const linkControl = createLinkControl(element.attributes as LinkAttributes)
    if (linkControl) {
      controls.link = linkControl
    }

    if (element.textContent) {
      controls.content = createTextInputControl(element.textContent)
    }
  } else if (isVideoElement(element.tagName)) {
    const videoSrc = element.attributes.src as string | undefined
    const poster = element.attributes.poster as string | undefined

    if (videoSrc && videoSrc !== '[dynamic]') {
      controls.video = {
        type: 'TextInput',
        value: videoSrc,
      }
    }

    if (poster && poster !== '[dynamic]') {
      const posterControl = createImageControl({ src: poster })
      if (posterControl) {
        controls.poster = posterControl
      }
    }
  } else if (element.textContent) {
    const inference = inferContentControlType(element)

    switch (inference.controlType) {
      case 'TextInput':
        controls.content = createTextInputControl(element.textContent)
        break
      case 'TextArea':
        controls.content = createTextAreaControl(element.textContent)
        break
      case 'RichText':
        controls.content = createRichTextControl(element.textContent)
        break
    }
  }

  for (const stateVariant of Object.keys(parseResult.stateClasses)) {
    for (const token of parseResult.stateClasses[stateVariant]) {
      unmappedClasses.push(token.raw)
    }
  }

  return { controls, unmappedClasses }
}

export function createSlotControl(
  children: ParsedJSXElement[],
  transformFn: (el: ParsedJSXElement) => import('../types').ElementSchema,
): SlotControlValue | null {
  if (children.length === 0) return null

  return {
    type: 'Slot',
    elements: children.map(transformFn),
  }
}

export function getControlsForElementType(
  element: ParsedJSXElement,
): string[] {
  const inference = inferElementType(element)
  return inference.suggestedControls
}

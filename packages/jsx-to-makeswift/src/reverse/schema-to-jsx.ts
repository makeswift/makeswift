/**
 * @fileoverview Transforms Makeswift control schemas back to JSX with Tailwind.
 *
 * This module provides functions to convert ElementSchema objects back into
 * JSX source code with Tailwind CSS classes.
 */

import type {
  ColorControlValue,
  ControlValue,
  ElementSchema,
  SlotControlValue,
  StyleControlValue,
  TypographyControlValue,
} from '../types'
import {
  addResponsivePrefix,
  mapColorToClass,
  mapStyleToClasses,
  mapTypographyToClasses,
} from './reverse-mapper'
import type {
  ReverseTransformInput,
  ReverseTransformOptions,
  ReverseTransformResult,
} from './types'

const DEFAULT_OPTIONS: Required<ReverseTransformOptions> = {
  preferShorthand: true,
  alwaysIncludeBreakpoints: false,
  indent: '  ',
  selfClosingTags: true,
}

const ELEMENT_TYPE_TO_TAG: Record<string, string> = {
  Container: 'div',
  Heading: 'h1',
  Paragraph: 'p',
  Text: 'span',
  Button: 'button',
  Link: 'a',
  Image: 'img',
  Nav: 'nav',
  Header: 'header',
  Footer: 'footer',
  Section: 'section',
  Article: 'article',
}

const SELF_CLOSING_TAGS = new Set(['img', 'input', 'br', 'hr', 'meta', 'link'])

type ClassCollector = {
  classes: string[]
  unmapped: string[]
}

function parseInput(input: ReverseTransformInput): ElementSchema[] {
  if (typeof input === 'string') {
    const parsed = JSON.parse(input)
    return Array.isArray(parsed) ? parsed : [parsed]
  }
  return Array.isArray(input) ? input : [input]
}

function collectClassesFromStyle(
  control: StyleControlValue,
  collector: ClassCollector,
): void {
  for (const deviceValue of control.value) {
    const { deviceId, value } = deviceValue
    const result = mapStyleToClasses(value)

    for (const cls of result.classes) {
      const prefixedClass = addResponsivePrefix(cls, deviceId)
      collector.classes.push(prefixedClass)
    }
    collector.unmapped.push(...result.unmapped)
  }
}

function collectClassesFromColor(
  control: ColorControlValue,
  collector: ClassCollector,
): void {
  for (const deviceValue of control.value) {
    const { deviceId, value } = deviceValue
    const cls = mapColorToClass(value.color, control.property)

    if (cls) {
      const prefixedClass = addResponsivePrefix(cls, deviceId)
      collector.classes.push(prefixedClass)
    }
  }
}

function collectClassesFromTypography(
  control: TypographyControlValue,
  collector: ClassCollector,
): void {
  for (const deviceValue of control.value) {
    const { deviceId, value } = deviceValue
    const result = mapTypographyToClasses(value)

    for (const cls of result.classes) {
      const prefixedClass = addResponsivePrefix(cls, deviceId)
      collector.classes.push(prefixedClass)
    }
    collector.unmapped.push(...result.unmapped)
  }
}

function collectClasses(
  controls: Record<string, ControlValue>,
): ClassCollector {
  const collector: ClassCollector = { classes: [], unmapped: [] }

  for (const [, control] of Object.entries(controls)) {
    switch (control.type) {
      case 'Style':
        collectClassesFromStyle(control, collector)
        break
      case 'Color':
        collectClassesFromColor(control, collector)
        break
      case 'Typography':
        collectClassesFromTypography(control, collector)
        break
    }
  }

  return collector
}

function deduplicateClasses(classes: string[]): string[] {
  const seen = new Map<string, string>()

  for (const cls of classes) {
    const hasPrefix = cls.includes(':')
    const baseClass = hasPrefix ? cls.split(':').slice(1).join(':') : cls
    const prefix = hasPrefix ? cls.split(':')[0] + ':' : ''
    const property = baseClass.split('-')[0]
    const key = `${prefix}${property}`
    seen.set(key, cls)
  }

  return Array.from(seen.values())
}

function orderClasses(classes: string[]): string[] {
  const prefixOrder: Record<string, number> = {
    '': 0,
    'sm:': 1,
    'md:': 2,
    'lg:': 3,
    'xl:': 4,
    '2xl:': 5,
  }

  const categoryOrder: Record<string, number> = {
    block: 0,
    inline: 0,
    flex: 0,
    grid: 0,
    hidden: 0,
    static: 1,
    fixed: 1,
    absolute: 1,
    relative: 1,
    sticky: 1,
    m: 2,
    mt: 2,
    mr: 2,
    mb: 2,
    ml: 2,
    mx: 2,
    my: 2,
    p: 3,
    pt: 3,
    pr: 3,
    pb: 3,
    pl: 3,
    px: 3,
    py: 3,
    w: 4,
    h: 4,
    min: 4,
    max: 4,
    gap: 5,
    bg: 6,
    text: 7,
    font: 8,
    leading: 9,
    tracking: 9,
    rounded: 10,
    border: 11,
    shadow: 12,
  }

  return [...classes].sort((a, b) => {
    const aHasPrefix = a.includes(':')
    const bHasPrefix = b.includes(':')

    const aPrefix = aHasPrefix ? a.split(':')[0] + ':' : ''
    const bPrefix = bHasPrefix ? b.split(':')[0] + ':' : ''

    const prefixDiff =
      (prefixOrder[aPrefix] ?? 99) - (prefixOrder[bPrefix] ?? 99)
    if (prefixDiff !== 0) return prefixDiff

    const aBase = aHasPrefix ? a.split(':').slice(1).join(':') : a
    const bBase = bHasPrefix ? b.split(':').slice(1).join(':') : b

    const aCategory = aBase.split('-')[0]
    const bCategory = bBase.split('-')[0]

    const categoryDiff =
      (categoryOrder[aCategory] ?? 50) - (categoryOrder[bCategory] ?? 50)
    if (categoryDiff !== 0) return categoryDiff

    return a.localeCompare(b)
  })
}

function getTextContent(controls: Record<string, ControlValue>): string | null {
  for (const [, control] of Object.entries(controls)) {
    if (
      control.type === 'TextInput' ||
      control.type === 'TextArea' ||
      control.type === 'RichText'
    ) {
      return control.value
    }
  }
  return null
}

function getImageAttributes(
  controls: Record<string, ControlValue>,
): Record<string, string> | null {
  for (const [, control] of Object.entries(controls)) {
    if (control.type === 'Image') {
      const attrs: Record<string, string> = {
        src: control.value.src,
      }
      if (control.value.alt) attrs.alt = control.value.alt
      if (control.value.width) attrs.width = control.value.width.toString()
      if (control.value.height) attrs.height = control.value.height.toString()
      return attrs
    }
  }
  return null
}

function getLinkAttributes(
  controls: Record<string, ControlValue>,
): Record<string, string> | null {
  for (const [, control] of Object.entries(controls)) {
    if (control.type === 'Link') {
      const attrs: Record<string, string> = {
        href: control.value.href,
      }
      if (control.value.target) attrs.target = control.value.target
      return attrs
    }
  }
  return null
}

function formatAttributes(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
}

function schemaToJSX(
  schema: ElementSchema,
  options: Required<ReverseTransformOptions>,
  depth: number = 0,
): { jsx: string; unmapped: string[] } {
  const indent = options.indent.repeat(depth)
  const childIndent = options.indent.repeat(depth + 1)

  const tagName = schema.tagName || ELEMENT_TYPE_TO_TAG[schema.type] || 'div'

  const { classes, unmapped } = collectClasses(schema.controls)
  const orderedClasses = orderClasses(deduplicateClasses(classes))
  const className = orderedClasses.join(' ')

  const textContent = getTextContent(schema.controls)
  const imageAttrs = getImageAttributes(schema.controls)
  const linkAttrs = getLinkAttributes(schema.controls)

  const attrs: string[] = []

  if (className) {
    attrs.push(`className="${className}"`)
  }

  if (imageAttrs) {
    attrs.push(formatAttributes(imageAttrs))
  }

  if (linkAttrs) {
    attrs.push(formatAttributes(linkAttrs))
  }

  const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : ''

  const isSelfClosing =
    options.selfClosingTags && SELF_CLOSING_TAGS.has(tagName)

  if (isSelfClosing) {
    return {
      jsx: `${indent}<${tagName}${attrString} />`,
      unmapped,
    }
  }

  const children = schema.children as SlotControlValue | undefined
  const hasChildren = children && children.elements && children.elements.length > 0

  if (!hasChildren && textContent) {
    return {
      jsx: `${indent}<${tagName}${attrString}>${textContent}</${tagName}>`,
      unmapped,
    }
  }

  if (!hasChildren && !textContent) {
    if (options.selfClosingTags) {
      return {
        jsx: `${indent}<${tagName}${attrString} />`,
        unmapped,
      }
    }
    return {
      jsx: `${indent}<${tagName}${attrString}></${tagName}>`,
      unmapped,
    }
  }

  const childrenJSX: string[] = []
  const allUnmapped = [...unmapped]

  if (textContent) {
    childrenJSX.push(`${childIndent}${textContent}`)
  }

  if (hasChildren) {
    for (const child of children.elements) {
      const childResult = schemaToJSX(child, options, depth + 1)
      childrenJSX.push(childResult.jsx)
      allUnmapped.push(...childResult.unmapped)
    }
  }

  const jsx = [
    `${indent}<${tagName}${attrString}>`,
    ...childrenJSX,
    `${indent}</${tagName}>`,
  ].join('\n')

  return { jsx, unmapped: allUnmapped }
}

/**
 * Transforms a Makeswift control schema back to JSX with Tailwind classes.
 *
 * This is the reverse operation of transformJSX. It takes an ElementSchema
 * and generates JSX source code with corresponding Tailwind utility classes.
 *
 * @param input - Schema object, array of schemas, or JSON string
 * @param options - Optional configuration for the transformation
 * @returns ReverseTransformResult containing JSX string, warnings, and unmapped values
 *
 * @example
 * ```typescript
 * import { transformSchemaToJSX } from '@makeswift/jsx-to-makeswift'
 *
 * const schema = {
 *   type: 'Container',
 *   tagName: 'div',
 *   controls: {
 *     style: {
 *       type: 'Style',
 *       properties: ['padding'],
 *       value: [{ deviceId: 'mobile', value: { padding: '1rem' } }]
 *     },
 *     content: { type: 'TextInput', value: 'Hello' }
 *   }
 * }
 *
 * const result = transformSchemaToJSX(schema)
 * console.log(result.jsx)
 * // <div className="p-4">Hello</div>
 * ```
 */
export function transformSchemaToJSX(
  input: ReverseTransformInput,
  options: Partial<ReverseTransformOptions> = {},
): ReverseTransformResult {
  const opts: Required<ReverseTransformOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  try {
    const schemas = parseInput(input)
    const results: { jsx: string; unmapped: string[] }[] = []

    for (const schema of schemas) {
      results.push(schemaToJSX(schema, opts, 0))
    }

    const jsx = results.map((r) => r.jsx).join('\n\n')
    const unmappedValues = [...new Set(results.flatMap((r) => r.unmapped))]

    return {
      jsx,
      warnings: [],
      unmappedValues,
    }
  } catch (error) {
    return {
      jsx: '',
      warnings: [error instanceof Error ? error.message : String(error)],
      unmappedValues: [],
    }
  }
}

/**
 * Transforms a schema to JSX and returns just the JSX string.
 *
 * This is a convenience function for simple use cases where you
 * don't need warnings or unmapped value information.
 *
 * @param input - Schema object, array of schemas, or JSON string
 * @param options - Optional configuration for the transformation
 * @returns JSX string
 */
export function schemaToJSXString(
  input: ReverseTransformInput,
  options: Partial<ReverseTransformOptions> = {},
): string {
  return transformSchemaToJSX(input, options).jsx
}

/**
 * @fileoverview Type definitions and Zod schemas for JSX to Makeswift Controls transformation.
 *
 * This module exports all the types and schemas needed to understand and validate
 * the output of the transformJSX function. AI agents can use these types for
 * type-safe integration and the Zod schemas for runtime validation.
 *
 * @module @makeswift/jsx-to-makeswift/types
 */

import { z } from 'zod'

/**
 * Zod schema for valid Makeswift control types.
 *
 * Use this to validate that a control type string is valid.
 */
export const ControlTypeSchema = z.enum([
  'Style',
  'Color',
  'Typography',
  'TextInput',
  'TextArea',
  'RichText',
  'Number',
  'Checkbox',
  'Select',
  'Image',
  'Link',
  'List',
  'Shape',
  'Group',
  'Slot',
])

/**
 * All valid Makeswift control types.
 *
 * - Style: CSS styling properties (margin, padding, layout, etc.)
 * - Color: Color values with alpha channel
 * - Typography: Font properties (size, weight, family, etc.)
 * - TextInput: Single-line text content
 * - TextArea: Multi-line text content
 * - RichText: Formatted text with inline elements
 * - Image: Image with src, alt, dimensions
 * - Link: URL/navigation with href and target
 * - Slot: Container for nested elements
 */
export type ControlType = z.infer<typeof ControlTypeSchema>

/**
 * Zod schema for Makeswift device IDs.
 *
 * Makeswift uses a 3-device responsive model:
 * - mobile: Base styles (no Tailwind prefix)
 * - tablet: Tailwind sm: prefix (640px+)
 * - desktop: Tailwind md:/lg:/xl:/2xl: prefixes (768px+)
 */
export const DeviceIdSchema = z.enum([
  'mobile',
  'tablet',
  'desktop',
])

/**
 * Valid device identifiers for responsive values.
 *
 * - mobile: Base styles, applies to all screen sizes
 * - tablet: Applies at 640px and above
 * - desktop: Applies at 768px and above
 */
export type DeviceId = z.infer<typeof DeviceIdSchema>

/**
 * A value override for a specific device.
 *
 * @template T - The type of the value being overridden
 */
export type DeviceOverride<T> = {
  deviceId: DeviceId
  value: T
}

/**
 * An array of device-specific value overrides.
 *
 * Values cascade from mobile → tablet → desktop.
 * Each entry specifies a value for a specific device.
 *
 * @template T - The type of the responsive value
 *
 * @example
 * ```typescript
 * const padding: ResponsiveValue<string> = [
 *   { deviceId: 'mobile', value: '1rem' },
 *   { deviceId: 'tablet', value: '1.5rem' },
 *   { deviceId: 'desktop', value: '2rem' }
 * ]
 * ```
 */
export type ResponsiveValue<T> = DeviceOverride<T>[]

/**
 * CSS properties that can be controlled by the Style control.
 */
export type StyleProperty =
  | 'margin'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'width'
  | 'height'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
  | 'display'
  | 'flexDirection'
  | 'justifyContent'
  | 'alignItems'
  | 'flexWrap'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'zIndex'
  | 'overflow'
  | 'borderWidth'
  | 'borderRadius'
  | 'borderStyle'
  | 'boxShadow'
  | 'opacity'

/**
 * Style control value containing CSS properties.
 *
 * Maps Tailwind classes like m-4, p-6, flex, rounded-lg to CSS properties.
 */
export type StyleControlValue = {
  type: 'Style'
  /** List of CSS properties this control manages */
  properties: StyleProperty[]
  /** Responsive CSS values */
  value: ResponsiveValue<Record<string, string | number>>
}

/**
 * Color control value for text, background, or border colors.
 *
 * Maps Tailwind color classes like text-blue-500, bg-gray-100.
 */
export type ColorControlValue = {
  type: 'Color'
  /** Which color property this control manages */
  property: 'textColor' | 'backgroundColor' | 'borderColor'
  /** Responsive color values with hex color and alpha */
  value: ResponsiveValue<{ color: string; alpha: number }>
}

/**
 * Typography control value for font properties.
 *
 * Maps Tailwind classes like text-xl, font-bold, leading-relaxed.
 */
export type TypographyControlValue = {
  type: 'Typography'
  /** Responsive typography values */
  value: ResponsiveValue<{
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
}

/**
 * Single-line text input control.
 *
 * Used for short text content like headings, labels, button text.
 */
export type TextInputControlValue = {
  type: 'TextInput'
  /** The text content */
  value: string
}

/**
 * Multi-line text area control.
 *
 * Used for longer text content like paragraphs, descriptions.
 */
export type TextAreaControlValue = {
  type: 'TextArea'
  /** The text content */
  value: string
}

/**
 * Rich text control for formatted content.
 *
 * Used when content contains inline formatting (bold, italic, links).
 */
export type RichTextControlValue = {
  type: 'RichText'
  /** The text content (may contain inline HTML) */
  value: string
}

/**
 * Number control for numeric values.
 */
export type NumberControlValue = {
  type: 'Number'
  value: number
}

/**
 * Checkbox control for boolean values.
 */
export type CheckboxControlValue = {
  type: 'Checkbox'
  value: boolean
}

/**
 * Image control for image elements.
 *
 * Extracted from <img> elements with src, alt, width, height attributes.
 */
export type ImageControlValue = {
  type: 'Image'
  value: {
    /** Image source URL */
    src: string
    /** Alt text for accessibility */
    alt?: string
    /** Image width in pixels */
    width?: number
    /** Image height in pixels */
    height?: number
  }
}

/**
 * Link control for anchor elements.
 *
 * Extracted from <a> elements with href and target attributes.
 */
export type LinkControlValue = {
  type: 'Link'
  value: {
    /** Link destination URL */
    href: string
    /** Link target (_blank, _self, etc.) */
    target?: string
  }
}

/**
 * List control for repeating elements.
 */
export type ListControlValue = {
  type: 'List'
  /** Template for list items */
  itemType: ControlValue
  /** Array of list item values */
  items: ControlValue[]
}

/**
 * Slot control for nested child elements.
 *
 * Contains an array of child ElementSchema objects.
 */
export type SlotControlValue = {
  type: 'Slot'
  /** Nested element schemas */
  elements: ElementSchema[]
}

/**
 * Union type of all possible control values.
 *
 * Each control value has a `type` field that discriminates the union.
 */
export type ControlValue =
  | StyleControlValue
  | ColorControlValue
  | TypographyControlValue
  | TextInputControlValue
  | TextAreaControlValue
  | RichTextControlValue
  | NumberControlValue
  | CheckboxControlValue
  | ImageControlValue
  | LinkControlValue
  | ListControlValue
  | SlotControlValue

/**
 * The main output schema for a transformed JSX element.
 *
 * This represents a single element in the Makeswift page structure.
 *
 * @example
 * ```typescript
 * const schema: ElementSchema = {
 *   type: 'Container',
 *   tagName: 'div',
 *   controls: {
 *     style: { type: 'Style', properties: ['margin'], value: [...] },
 *     content: { type: 'TextInput', value: 'Hello World' }
 *   },
 *   children: { type: 'Slot', elements: [...] }
 * }
 * ```
 */
export type ElementSchema = {
  /** Inferred element type (Container, Heading, Paragraph, Button, Image, Link, etc.) */
  type: string
  /** Original HTML tag name (div, h1, p, button, img, a, etc.) */
  tagName: string
  /** Map of control names to control values */
  controls: Record<string, ControlValue>
  /** Child elements wrapped in a Slot control */
  children?: SlotControlValue
  /** Optional metadata about the transformation */
  metadata?: {
    /** Original Tailwind className string */
    originalClassName?: string
    /** State variant classes grouped by variant (hover, focus, etc.) */
    stateVariants?: Record<string, string[]>
  }
}

/**
 * Internal representation of a parsed JSX element.
 */
export type ParsedJSXElement = {
  tagName: string
  className: string | null
  attributes: Record<string, unknown>
  textContent: string | null
  children: ParsedJSXElement[]
  hasRichContent: boolean
}

/**
 * Token representing a parsed Tailwind class.
 */
export type TailwindClassToken = {
  /** Original class string */
  raw: string
  /** Responsive prefix (sm, md, lg, xl, 2xl) or null */
  prefix: string | null
  /** State variant (hover, focus, etc.) or null */
  variant: string | null
  /** Utility name (m, p, bg, text, flex, etc.) */
  utility: string
  /** Utility value (4, blue-500, center, etc.) or null */
  value: string | null
  /** Whether value is arbitrary (e.g., w-[300px]) */
  isArbitrary: boolean
  /** Whether value is negative (e.g., -mt-4) */
  isNegative: boolean
}

/**
 * Result of parsing Tailwind classes from a className string.
 */
export type TailwindParseResult = {
  /** Base classes without responsive or state prefixes */
  baseClasses: TailwindClassToken[]
  /** Classes grouped by device ID */
  responsiveClasses: Record<DeviceId, TailwindClassToken[]>
  /** Classes grouped by state variant */
  stateClasses: Record<string, TailwindClassToken[]>
}

/**
 * Options for controlling the transformation process.
 */
export type TransformOptions = {
  /** Infer content control types (TextInput, TextArea, RichText) */
  inferContentControls?: boolean
  /** Include hover:, focus:, etc. in metadata */
  includeStateVariants?: boolean
  /** Preserve original className in metadata */
  preserveOriginalClasses?: boolean
}

/**
 * Result of transforming a single element.
 */
export type TransformResult = {
  /** The generated schema for this element */
  schema: ElementSchema
  /** Non-fatal warnings during transformation */
  warnings: string[]
  /** Tailwind classes that could not be mapped */
  unmappedClasses: string[]
}

/**
 * Zod schema for validating StyleProperty strings.
 */
export const StylePropertySchema = z.enum([
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'gap',
  'rowGap',
  'columnGap',
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'flexWrap',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',
  'overflow',
  'borderWidth',
  'borderRadius',
  'borderStyle',
  'boxShadow',
  'opacity',
])

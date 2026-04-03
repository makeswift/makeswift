import type { ElementSchema } from '../types'

/**
 * Options for reverse transformation (Schema → JSX).
 */
export type ReverseTransformOptions = {
  /** Use shorthand classes when possible (e.g., p-4 instead of pt-4 pr-4 pb-4 pl-4) */
  preferShorthand?: boolean
  /** Include responsive prefixes even when value matches mobile */
  alwaysIncludeBreakpoints?: boolean
  /** Indentation string (default: 2 spaces) */
  indent?: string
  /** Use self-closing tags for empty elements */
  selfClosingTags?: boolean
}

/**
 * Result of reverse transformation.
 */
export type ReverseTransformResult = {
  /** Generated JSX string */
  jsx: string
  /** Warnings during transformation */
  warnings: string[]
  /** CSS values that couldn't be mapped to Tailwind classes */
  unmappedValues: string[]
}

/**
 * Input for reverse transformation - can be schema object or JSON string.
 */
export type ReverseTransformInput = ElementSchema | ElementSchema[] | string

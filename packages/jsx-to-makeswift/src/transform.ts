import { buildSchema, buildSingleSchema } from './controls/schema-builder'
import { parseJSX, parseJSXFragment } from './parser/jsx-parser'
import type { ElementSchema, TransformOptions, TransformResult } from './types'

/**
 * Options for the transformJSX function.
 *
 * @property fragment - If true, wraps the input in a fragment before parsing.
 *                      Use this when the input contains multiple root elements.
 * @property inferContentControls - If true, infers content control types (TextInput, TextArea, RichText).
 * @property includeStateVariants - If true, includes hover:, focus:, etc. in metadata.
 * @property preserveOriginalClasses - If true, stores original Tailwind classes in metadata.
 */
export type TransformJSXOptions = TransformOptions & {
  fragment?: boolean
}

/**
 * Result of transforming JSX to Makeswift control schemas.
 *
 * @property schemas - Array of generated ElementSchema objects.
 * @property results - Detailed transform results including warnings and unmapped classes per element.
 * @property errors - Parse errors that prevented transformation.
 * @property warnings - Non-fatal warnings during transformation.
 * @property unmappedClasses - Tailwind classes that could not be mapped to controls.
 */
export type TransformJSXResult = {
  schemas: ElementSchema[]
  results: TransformResult[]
  errors: string[]
  warnings: string[]
  unmappedClasses: string[]
}

/**
 * Transforms JSX source code with Tailwind CSS classes into Makeswift control schemas.
 *
 * This is the primary entry point for converting JSX to Makeswift controls.
 * It parses the JSX, resolves Tailwind classes to CSS properties, and maps
 * those properties to appropriate Makeswift control types.
 *
 * @param source - JSX source code as a string
 * @param options - Optional configuration for the transformation
 * @returns TransformJSXResult containing schemas, errors, warnings, and unmapped classes
 *
 * @example
 * ```typescript
 * import { transformJSX } from '@makeswift/jsx-to-makeswift'
 *
 * const jsx = `<div className="m-4 p-6 bg-blue-500">Hello</div>`
 * const result = transformJSX(jsx)
 *
 * console.log(result.schemas[0])
 * // {
 * //   type: 'Container',
 * //   tagName: 'div',
 * //   controls: {
 * //     style: { type: 'Style', properties: ['margin', 'padding'], ... },
 * //     backgroundColor: { type: 'Color', ... },
 * //     content: { type: 'TextInput', value: 'Hello' }
 * //   }
 * // }
 * ```
 */
export function transformJSX(
  source: string,
  options: Partial<TransformJSXOptions> = {},
): TransformJSXResult {
  const { fragment = false, ...transformOptions } = options

  const parseResult = fragment ? parseJSXFragment(source) : parseJSX(source)

  if (parseResult.errors.length > 0) {
    return {
      schemas: [],
      results: [],
      errors: parseResult.errors,
      warnings: [],
      unmappedClasses: [],
    }
  }

  const results = buildSchema(parseResult.elements, transformOptions)

  const schemas = results.map((r) => r.schema)
  const allWarnings = results.flatMap((r) => r.warnings)
  const allUnmapped = [...new Set(results.flatMap((r) => r.unmappedClasses))]

  return {
    schemas,
    results,
    errors: [],
    warnings: allWarnings,
    unmappedClasses: allUnmapped,
  }
}

/**
 * Transforms a single JSX element to a Makeswift control schema.
 *
 * Use this when you have exactly one root element and want a simpler result type.
 * Returns null if parsing fails or no elements are found.
 *
 * @param source - JSX source code containing a single element
 * @param options - Optional configuration for the transformation
 * @returns TransformResult or null if transformation failed
 *
 * @example
 * ```typescript
 * const result = transformJSXElement(`<h1 className="text-2xl">Title</h1>`)
 * if (result) {
 *   console.log(result.schema.type) // 'Heading'
 * }
 * ```
 */
export function transformJSXElement(
  source: string,
  options: Partial<TransformOptions> = {},
): TransformResult | null {
  const parseResult = parseJSX(source)

  if (parseResult.errors.length > 0 || parseResult.elements.length === 0) {
    return null
  }

  return buildSingleSchema(parseResult.elements[0], options)
}

/**
 * Transforms JSX to a JSON string representation of Makeswift control schemas.
 *
 * This is a convenience function that combines transformJSX with JSON.stringify.
 * Useful for CLI tools, debugging, or when JSON output is needed directly.
 *
 * @param source - JSX source code as a string
 * @param options - Optional configuration for the transformation
 * @returns Pretty-printed JSON string of the schema(s) or error object
 *
 * @example
 * ```typescript
 * const json = transformJSXToJSON(`<div className="p-4">Hello</div>`)
 * console.log(json)
 * // {
 * //   "type": "Container",
 * //   "tagName": "div",
 * //   "controls": { ... }
 * // }
 * ```
 */
export function transformJSXToJSON(
  source: string,
  options: Partial<TransformJSXOptions> = {},
): string {
  const result = transformJSX(source, options)

  if (result.errors.length > 0) {
    return JSON.stringify({ errors: result.errors }, null, 2)
  }

  if (result.schemas.length === 1) {
    return JSON.stringify(result.schemas[0], null, 2)
  }

  return JSON.stringify(result.schemas, null, 2)
}

export { buildSchema, buildSingleSchema } from './controls/schema-builder'
export { parseJSX, parseJSXFragment } from './parser/jsx-parser'

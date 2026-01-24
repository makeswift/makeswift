import { z } from 'zod'

import type {
  ElementSchema,
  ParsedJSXElement,
  TransformOptions,
  TransformResult,
} from '../types'

import { tokenizeTailwindClasses } from '../tailwind/tokenizer'

import { createSlotControl, mapElementToControls } from './control-mapper'
import { inferElementType } from './type-inference'

const DEFAULT_OPTIONS: TransformOptions = {
  inferContentControls: true,
  includeStateVariants: false,
  preserveOriginalClasses: false,
}

function transformElement(
  element: ParsedJSXElement,
  options: TransformOptions,
): ElementSchema {
  const { controls } = mapElementToControls(element)
  const { elementType } = inferElementType(element)

  const schema: ElementSchema = {
    type: elementType,
    tagName: element.tagName,
    controls,
  }

  if (element.children.length > 0) {
    const slot = createSlotControl(element.children, (child) =>
      transformElement(child, options),
    )
    if (slot) {
      schema.children = slot
    }
  }

  if (options.preserveOriginalClasses && element.className) {
    schema.metadata = {
      ...schema.metadata,
      originalClassName: element.className,
    }
  }

  if (options.includeStateVariants && element.className) {
    const parseResult = tokenizeTailwindClasses(element.className)
    const stateVariants: Record<string, string[]> = {}

    for (const [variant, tokens] of Object.entries(parseResult.stateClasses)) {
      stateVariants[variant] = tokens.map((t) => t.raw)
    }

    if (Object.keys(stateVariants).length > 0) {
      schema.metadata = {
        ...schema.metadata,
        stateVariants,
      }
    }
  }

  return schema
}

export function buildSchema(
  elements: ParsedJSXElement[],
  options: Partial<TransformOptions> = {},
): TransformResult[] {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  return elements.map((element) => {
    const allUnmapped: string[] = []
    const allWarnings: string[] = []

    const collectUnmapped = (el: ParsedJSXElement): void => {
      const parseResult = tokenizeTailwindClasses(el.className)

      for (const variant of Object.keys(parseResult.stateClasses)) {
        for (const token of parseResult.stateClasses[variant]) {
          allUnmapped.push(token.raw)
        }
      }

      for (const child of el.children) {
        collectUnmapped(child)
      }
    }

    collectUnmapped(element)

    const schema = transformElement(element, mergedOptions)

    return {
      schema,
      warnings: allWarnings,
      unmappedClasses: [...new Set(allUnmapped)],
    }
  })
}

export function buildSingleSchema(
  element: ParsedJSXElement,
  options: Partial<TransformOptions> = {},
): TransformResult {
  const results = buildSchema([element], options)
  return results[0]
}

type ElementSchemaValidatorType = z.ZodObject<{
  type: z.ZodString
  tagName: z.ZodString
  controls: z.ZodRecord<z.ZodString, z.ZodAny>
  children: z.ZodOptional<z.ZodObject<{
    type: z.ZodLiteral<'Slot'>
    elements: z.ZodArray<z.ZodLazy<z.ZodTypeAny>>
  }>>
  metadata: z.ZodOptional<z.ZodObject<{
    originalClassName: z.ZodOptional<z.ZodString>
    stateVariants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>
  }>>
}>

export const ElementSchemaValidator: ElementSchemaValidatorType = z.object({
  type: z.string(),
  tagName: z.string(),
  controls: z.record(z.string(), z.any()),
  children: z
    .object({
      type: z.literal('Slot'),
      elements: z.array(z.lazy((): z.ZodTypeAny => ElementSchemaValidator)),
    })
    .optional(),
  metadata: z
    .object({
      originalClassName: z.string().optional(),
      stateVariants: z.record(z.string(), z.array(z.string())).optional(),
    })
    .optional(),
})

export function validateSchema(schema: unknown): {
  valid: boolean
  errors: string[]
} {
  const result = ElementSchemaValidator.safeParse(schema)

  if (result.success) {
    return { valid: true, errors: [] }
  }

  return {
    valid: false,
    errors: result.error.errors.map(
      (e) => `${e.path.join('.')}: ${e.message}`,
    ),
  }
}

export function serializeSchema(schema: ElementSchema): string {
  return JSON.stringify(schema, null, 2)
}

export function deserializeSchema(json: string): ElementSchema | null {
  try {
    const parsed = JSON.parse(json)
    const validation = validateSchema(parsed)

    if (validation.valid) {
      return parsed as ElementSchema
    }

    console.error('Schema validation errors:', validation.errors)
    return null
  } catch (error: unknown) {
    console.error('Failed to parse schema JSON:', error)
    return null
  }
}

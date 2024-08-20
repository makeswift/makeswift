import { z } from 'zod'

import { AddIndexSignature } from '../../../lib/add-index-signature'

import {
  ObjectType,
  type AnnotationJSON,
  type DocumentJSON,
  type SelectionJSON,
} from './types'

export const objectType = z.union([
  z.literal(ObjectType.Value),
  z.literal(ObjectType.Text),
  z.literal(ObjectType.Inline),
  z.literal(ObjectType.Block),
  z.literal(ObjectType.Document),
  z.literal(ObjectType.Leaf),
  z.literal(ObjectType.Selection),
  z.literal(ObjectType.Mark),
  z.literal(ObjectType.Range),
  z.literal(ObjectType.Decoration),
  z.literal(ObjectType.Annotation),
  z.literal(ObjectType.Point),
  z.literal(ObjectType.Operation),
  z.undefined(),
])

function any<R>() {
  return z.any() as z.ZodType<AddIndexSignature<R>>
}

export const valueJSON = z.object({
  object: objectType.optional(),
  document: any<DocumentJSON>().optional(),
  selection: any<SelectionJSON>().optional(),
  annotations: z.record(z.string(), any<AnnotationJSON>()).optional(),
  data: z.record(z.string(), z.any()).optional(),
})

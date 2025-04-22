import { Base64 } from 'js-base64'
import { Element } from '@makeswift/controls'

import { z } from 'zod'
import { APIResourceType } from '../../api'

function isAPIResourceType(val: string): val is APIResourceType {
  return APIResourceType[val as keyof typeof APIResourceType] != null
}

const parseResourceIdSchema = z.string().transform((val, ctx) => {
  try {
    const match = Base64.decode(val).match(/^([^:]+):([^:]+)$/)
    if (!match) throw new TypeError(`NodeID cannot represent value: ${String(val)}`)
    const [, typeName, key] = match
    if (isAPIResourceType(typeName)) {
      return { key, typeName }
    }
    throw new TypeError(`decoded type '${typeName}' is not a valid APIResourceType`)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${String(val)} is not a valid node resource ID`,
    })
    return z.NEVER
  }
})

export function unstructuredIntrospection(element: Element): {
  swatchIds: Set<string>
  typographyIds: Set<string>
  fileIds: Set<string>
  tableIds: Set<string>
  pageIds: Set<string>
  globalElementIds: Set<string>
} {
  const typeIdsToFound: Map<APIResourceType, Set<string>> = new Map()
  Object.values(APIResourceType).forEach(resourceType => {
    typeIdsToFound.set(resourceType, new Set())
  })
  function findResourceIds(curr: unknown): void {
    if (typeof curr === 'string') {
      const parseResourceResult = parseResourceIdSchema.safeParse(curr)
      if (parseResourceResult.success) {
        typeIdsToFound.get(parseResourceResult.data.typeName)?.add(curr)
      }
    } else if (Array.isArray(curr)) {
      for (const item of curr) {
        findResourceIds(item)
      }
    } else if (curr != null && typeof curr === 'object') {
      for (const key in curr) {
        if (Object.prototype.hasOwnProperty.call(curr, key)) {
          findResourceIds(curr[key as keyof typeof curr])
        }
      }
    }
  }

  findResourceIds(element)
  return {
    swatchIds: typeIdsToFound.get(APIResourceType.Swatch) ?? new Set(),
    typographyIds: typeIdsToFound.get(APIResourceType.Typography) ?? new Set(),
    fileIds: typeIdsToFound.get(APIResourceType.File) ?? new Set(),
    tableIds: typeIdsToFound.get(APIResourceType.Table) ?? new Set(),
    pageIds: typeIdsToFound.get(APIResourceType.Page) ?? new Set(),
    globalElementIds: typeIdsToFound.get(APIResourceType.GlobalElement) ?? new Set(),
  }
}

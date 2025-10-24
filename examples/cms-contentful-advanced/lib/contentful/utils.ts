import { Document } from '@contentful/rich-text-types'

import { Asset, BlogPostBodyLinks, TypeFragment } from '@/generated/contentful'

export type ResolvedField = { data: unknown } | { error: string }

export const isRichTextField = (fieldType: TypeFragment) =>
  fieldType.fields?.find(f => f.name === 'json') && fieldType.fields?.find(f => f.name === 'links')

export const isRichText = (field: any): field is { json: Document; links: BlogPostBodyLinks } =>
  field?.json?.nodeType === 'document'

export const isAsset = (field: any): field is Asset => {
  return field?.__typename === 'Asset'
}

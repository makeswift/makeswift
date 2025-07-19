import { ResponsiveImageType, StructuredTextGraphQlResponse } from 'react-datocms'

import { TypeFragment } from '@/generated/dato'

export type ResolvedField = { data: unknown } | { error: string }

export const isRichTextField = (fieldType: TypeFragment) => {
  return fieldType.fields?.find(f => f.name === 'BlogpostModelBodyField')
}
export const isRichText = (field: any): field is StructuredTextGraphQlResponse => {
  return field?.__typename === 'BlogpostModelBodyField'
}
export const isDatoImage = (field: any): field is ResponsiveImageType =>
  field?.__typename === 'ResponsiveImage'

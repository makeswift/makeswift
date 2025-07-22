import { NextResponse } from 'next/server'

import { Blogpost, TypeFragment, TypesDocument } from '@/generated/prismic'
import { client } from '@/lib/prismic/client'
import { isRichTextField } from '@/lib/prismic/utils'

export type ResolvedField = { data: unknown } | { error: string }

type FieldPath = { label: string; path: string; type?: string | null }
type EntryType = 'Blogpost'

function flattenFields(
  root: TypeFragment,
  fields: FieldPath[] = [],
  path: string[] = []
): FieldPath[] {
  if (!root.fields) return fields

  root.fields.forEach(field => {
    const newPath = [...path, field.name]

    fields.push({
      label: [field.name, ...path.slice().reverse()].join(' < '),
      path: newPath.join('.'),
      type: isRichTextField(field.type) ? 'RichText' : field.type.name,
    })

    flattenFields(field.type, fields, newPath)
  })

  return fields
}

export async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: EntryType
  filter?: ((type?: string | null) => boolean) | string[]
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => {
      if (typeof filter === 'function') {
        return filter(field.type)
      }
      if (Array.isArray(filter)) {
        return filter.includes(field.path.split('.').pop() || '')
      }
      return true
    })
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
}

export async function GET(
  request: Request,
  { params }: { params: { content_type: string } }
): Promise<NextResponse> {
  const { content_type } = params

  const { searchParams } = new URL(request.url)
  const fieldTypes = searchParams.getAll('fieldType')
  const query = searchParams.get('query') ?? ''

  if (content_type !== 'Blogpost') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  }

  return NextResponse.json(
    await getFieldOptions({
      type: content_type,
      filter: fieldTypes.length > 0 ? fieldTypes : undefined,
      query,
    })
  )
}

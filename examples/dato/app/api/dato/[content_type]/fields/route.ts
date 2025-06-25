import { NextResponse } from 'next/server'

import { TypeFragment, TypesDocument } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { isRichTextField } from '@/lib/dato/utils'

export type ResolvedField = { data: unknown } | { error: string }

type FieldPath = { label: string; path: string; type?: string | null }
type EntryType = 'BlogpostRecord'

function flattenFields(
  root: TypeFragment,
  fields: FieldPath[] = [],
  path: string[] = []
): FieldPath[] {
  if (!root?.fields) return fields

  root.fields.forEach(field => {
    const newPath = [...path, field.name]

    fields.push({
      label: [field.name, ...path.reverse()].join(' < '),
      path: newPath.join('.'),
      type: isRichTextField(field.type) ? 'BlogpostModelBodyField' : field.type.name,
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
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => (filter ? filter(field.type) : true))
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
    .sort(field => (field.value.split('<').length > 1 ? 1 : -1))
}

export async function GET(
  request: Request,
  { params }: { params: { content_type: string } }
): Promise<NextResponse> {
  const { content_type } = params

  const { searchParams } = new URL(request.url)
  const fieldType = searchParams.get('fieldType')
  const query = searchParams.get('query') ?? ''

  if (content_type !== 'BlogpostRecord') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  }

  return NextResponse.json(
    await getFieldOptions({
      type: content_type,
      filter: fieldType ? type => type === fieldType : undefined,
      query,
    })
  )
}

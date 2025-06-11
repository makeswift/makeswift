import { NextResponse } from 'next/server'

import { TypeFragment, TypesDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { isRichTextField } from '@/lib/contentful/utils'

type FieldPath = { label: string; path: string; type?: string | null }

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

async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: 'BlogPost' | 'Author'
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => (filter ? filter(field.type) : true))
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
}

export async function GET(
  request: Request,
  { params }: { params: { content_type: string } }
): Promise<NextResponse> {
  const { content_type } = params

  const { searchParams } = new URL(request.url)
  const fieldType = searchParams.get('fieldType')
  const query = searchParams.get('query') ?? ''

  if (content_type !== 'BlogPost' && content_type !== 'Author') {
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

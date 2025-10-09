import { NextResponse } from 'next/server'

import { client } from '@/lib/dato/client'

type FieldPath = { label: string; path: string; type?: string | null }

type TypeFragment = {
  name?: string | null
  fields?: Array<{
    name: string
    type: {
      name?: string | null
      fields?: Array<{
        name: string
        type: {
          name?: string | null
        }
      }> | null
    }
  }> | null
}

const isStructuredTextField = (fieldType: TypeFragment) =>
  fieldType.fields?.find(f => f.name === 'value') && 
  fieldType.fields?.find(f => f.name === 'blocks')

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
      type: isStructuredTextField(field.type) ? 'StructuredText' : field.type.name,
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
  type: 'BlogpostRecord' | 'AuthorRecord'
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const TypesDocument = `
    fragment Type on __Type {
      name
      fields {
        name
        type {
          name
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }

    query Types($name: String!) {
      __type(name: $name) {
        ...Type
      }
    }
  `

  const data = await client.request<{ __type: TypeFragment | null }>(TypesDocument, { name: type })

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
  const { content_type } = await params

  const { searchParams } = new URL(request.url)
  const fieldType = searchParams.get('fieldType')
  const query = searchParams.get('query') ?? ''

  if (content_type !== 'BlogpostRecord' && content_type !== 'AuthorRecord') {
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

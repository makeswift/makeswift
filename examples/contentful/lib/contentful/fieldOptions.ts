import { z } from 'zod'

const fieldOptionsSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
  })
)

type FieldOptions = z.infer<typeof fieldOptionsSchema>

export async function fetchFieldOptions({
  contentType,
  fieldType,
  query,
}: {
  contentType: string
  fieldType: string
  query: string
}): Promise<FieldOptions> {
  const queryParams = new URLSearchParams({ fieldType, query })
  const res = await fetch(
    `/api/contentful/${encodeURIComponent(contentType)}/fields?${queryParams.toString()}`
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch field options: ${res.statusText}`)
  }

  return fieldOptionsSchema.parse(await res.json())
}

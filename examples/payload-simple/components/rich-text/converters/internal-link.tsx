import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!

  const slug = typeof value === 'object' && value && 'slug' in value ? value.slug : undefined

  if (relationTo === 'posts') {
    return `/blog/${slug}`
  } else {
    return `/${slug}`
  }
}

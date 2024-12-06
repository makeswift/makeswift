import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import useSWR from 'swr'

import { BlogFeedDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { useSlug } from '@/lib/utils'

type Props = {
  className?: string
}

export function BlogRichText({ className }: Props) {
  const slug = useSlug()
  const { data, isLoading } = useSWR(
    `blog/${slug} }}`,
    () => client.request(BlogFeedDocument, { filter: { slug } }),
    {
      keepPreviousData: true,
    }
  )
  console.log({ data })
  const html = documentToHtmlString(data?.blogCollection?.items[0]?.body.json)

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

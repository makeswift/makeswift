import { BlogFeed } from '@/components/builtins/BlogFeed'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'

export default async function BlogFeedPage() {
  const blogs = await getAllBlogs()

  return (
    <ContentfulProvider value={blogs}>
      <BlogFeed label="Blog Feed" id="blog-feed" />
    </ContentfulProvider>
  )
}

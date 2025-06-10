import { BlogFeed } from '@/components/builtins/BlogFeed'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { DatoProvider } from '@/lib/dato/provider'

export default async function BlogFeedPage() {
  const allBlogposts = await getAllBlogs()

  return (
    <DatoProvider value={allBlogposts}>
      <BlogFeed label="Blog Feed" id="blog-feed" />
    </DatoProvider>
  )
}

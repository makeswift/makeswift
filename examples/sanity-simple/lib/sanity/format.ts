import { GetBlogsQuery } from '@/generated/sanity'
import { type BlogPost as BlogPostSummary } from '@/vibes/soul/primitives/blog-post-card'
import { type BlogPost as BlogPostContent } from '@/vibes/soul/sections/blog-post-content'

export type BlogPostData = NonNullable<GetBlogsQuery['allPost'][0]>

export const formatBlogs = (blogs: BlogPostData[]): BlogPostSummary[] => {
  return blogs.map(blog => formatBlogData(blog, false))
}

export const formatBlog = (blog: BlogPostData): BlogPostContent => {
  return formatBlogData(blog, true)
}

function formatBlogData(blog: BlogPostData, includeBody: false): BlogPostSummary
function formatBlogData(blog: BlogPostData, includeBody: true): BlogPostContent
function formatBlogData(
  blog: BlogPostData,
  includeBody: boolean
): BlogPostSummary | BlogPostContent {
  if (!blog.slug?.current || !blog.title || !blog.publishedAt || !blog.image?.asset?.url) {
    throw new Error('Blog post is missing one or more required fields')
  }

  return {
    title: blog.title,
    date: new Date(blog.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: includeBody && blog.bodyRaw ? blog.bodyRaw : blog.description,
    image: blog.image?.asset
      ? { src: blog.image.asset.url, alt: blog.image.asset.title || blog.title }
      : null,
    author: blog.author?.name ?? null,
    href: `/blog/${blog.slug.current}`,
  }
}

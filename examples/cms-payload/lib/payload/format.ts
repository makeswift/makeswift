import { env } from '@/env'
import { GetBlogsQuery } from '@/generated/payload'
import { type BlogPost as BlogPostSummary } from '@/vibes/soul/primitives/blog-post-card'
import { type BlogPost as BlogPostContent } from '@/vibes/soul/sections/blog-post-content'

export type BlogPostData = NonNullable<GetBlogsQuery['Posts']>['docs'][0]

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
  if (!blog.slug || !blog.title || !blog.updatedAt || !blog.banner.url) {
    throw new Error('Blog post is missing one or more required fields')
  }

  return {
    title: blog.title,
    date: new Date(blog.feedDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: includeBody && blog.body ? blog.body : blog.description,
    image: blog.banner.url
      ? {
          src: `${env.NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN}/${blog.banner.url}`,
          alt: blog.banner.alt || blog.title,
        }
      : null,
    author: blog.author?.name ?? null,
    href: `/blog/${blog.slug}`,
  }
}

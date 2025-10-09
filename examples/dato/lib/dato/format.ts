import { render } from 'datocms-structured-text-to-html-string'

import { GetBlogsQuery } from '@/generated/dato'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<NonNullable<GetBlogsQuery['allBlogposts']>[0]>

export const formatBlogs = (
  blogs: BlogPostFromQuery[],
  includeBody: boolean = true
): FormattedBlogPost[] => {
  return blogs.map(blog => formatBlog(blog, includeBody))
}

export const formatBlog = (
  blog: BlogPostFromQuery,
  includeBody: boolean = true
): FormattedBlogPost => {
  if (
    !blog.title ||
    !blog.feedDate ||
    !blog.banner?.responsiveImage?.src ||
    (includeBody && !blog.body?.value)
  ) {
    throw new Error('Blog post is missing one or more required fields')
  }

  return {
    title: blog.title,
    date: new Date(blog.feedDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: includeBody && blog.body?.value ? render(blog.body.value as any) : blog.description,
    image: blog.banner?.responsiveImage
      ? { src: blog.banner.responsiveImage.src, alt: blog.banner.responsiveImage.alt || blog.title }
      : null,
    author: blog.author?.name,
    href: `/blog/${blog.slug}`,
  }
}

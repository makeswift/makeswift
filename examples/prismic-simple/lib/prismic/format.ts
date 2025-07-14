import { asHTML } from '@prismicio/client'

import { type GetBlogQuery, type GetBlogsQuery } from '@/generated/prismic'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostSummary = NonNullable<
  NonNullable<GetBlogsQuery['allBlogposts']['edges']>[number]
>['node']

export type BlogPost = NonNullable<NonNullable<GetBlogQuery['blogpost']>>

export const formatBlogs = (blogs: BlogPostSummary[]): FormattedBlogPost[] => {
  return blogs.map(blog => formatBlog(blog))
}

export const formatBlog = (blog: BlogPostSummary | BlogPost): FormattedBlogPost => {
  if (!blog.title || !blog.feed_date || !blog.hero?.url) {
    throw new Error('Blog post is missing one or more required fields')
  }

  return {
    title: blog.title,
    date: new Date(blog.feed_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content:
      'body' in blog ? asHTML((blog as BlogPost).body) : (blog as BlogPostSummary).description,
    image: blog.hero ? { src: blog.hero.url, alt: blog.title } : null,
    author: blog.author?.__typename === 'Author' ? blog.author.name : null,
    href: `/blog/${blog._meta?.uid}`,
  }
}

'use server'

import React from 'react'

import { Warning } from '@/components/warning'
import { getBlogPost } from '@/lib/dato/fetchers'
import { formatBlog } from '@/lib/dato/format'
import { BlogPostContent } from '@/vibes/soul/sections/blog-post-content'

export const BlogPost = async ({ slug }: { slug: string }) => {
  const blogPost = await getBlogPost(slug)

  if (!blogPost) {
    return <Warning>No blog post available</Warning>
  }

  const formattedBlog = formatBlog(blogPost)
  const breadcrumbs = [
    {
      id: '1',
      label: 'Home',
      href: '/',
    },
    {
      id: '2',
      label: 'Blog',
      href: '/blog',
    },
    {
      id: '3',
      label: formattedBlog.title,
      href: '#',
    },
  ]

  return <BlogPostContent breadcrumbs={breadcrumbs} blogPost={formattedBlog} />
}

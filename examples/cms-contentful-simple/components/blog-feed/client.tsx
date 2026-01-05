'use client'

import React, { useMemo, useState } from 'react'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import useSWR from 'swr'

import { Warning } from '@/components/warning'
import { type BlogPostFromQuery, formatBlogs } from '@/lib/contentful/format'
import { Button } from '@/vibes/soul/primitives/button'
import { BlogPostList, BlogPostListSkeleton } from '@/vibes/soul/sections/blog-post-list'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

interface Props {
  className?: string
  itemsPerPage: number
  showPagination: boolean
}

interface BlogFeedResponse {
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}

const fetcher = async (url: string): Promise<BlogFeedResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch blog feed: ${res.status}`)
  }

  return await res.json()
}

export const BlogFeed = ({ className, itemsPerPage, showPagination }: Props) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const skip = currentPage * itemsPerPage

  const { data, error, isLoading } = useSWR<BlogFeedResponse>(
    `/api/contentful/feed?limit=${itemsPerPage}&skip=${skip}`,
    fetcher,
    {
      onSuccess: data => setTotalPages(Math.ceil(data.total / itemsPerPage)),
    }
  )

  const blogPosts = useMemo(() => formatBlogs(data?.blogs ?? [], false), [data])

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  if (error) {
    return <Warning>{error.message}</Warning>
  }

  return (
    <SectionLayout className={className}>
      {isLoading ? (
        <BlogPostListSkeleton placeholderCount={itemsPerPage} />
      ) : (
        <BlogPostList blogPosts={blogPosts} />
      )}

      {showPagination && totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
        />
      )}
    </SectionLayout>
  )
}

const PaginationBar = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}) => {
  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <ArrowButton onClick={onPrev} disabled={currentPage <= 0} left={true} />
      <div className="text-muted-foreground text-sm">
        Page {currentPage + 1} of {totalPages}
      </div>
      <ArrowButton onClick={onNext} disabled={currentPage >= totalPages - 1} />
    </div>
  )
}

const ArrowButton = ({
  onClick,
  disabled,
  left,
}: {
  onClick: () => void
  disabled: boolean
  left?: boolean
}) => {
  const Icon = left ? ArrowLeft : ArrowRight
  return (
    <Button onClick={onClick} variant="ghost" size="small" disabled={disabled}>
      <Icon size={24} strokeWidth={1} />
    </Button>
  )
}

import Image from 'next/image'

import { clsx } from 'clsx'

import { Stream, Streamable } from '@/vibes/soul/lib/streamable'
import { ButtonLink } from '@/vibes/soul/primitives/button-link'
import * as Skeleton from '@/vibes/soul/primitives/skeleton'
import {
  type Breadcrumb,
  Breadcrumbs,
  BreadcrumbsSkeleton,
} from '@/vibes/soul/sections/breadcrumbs'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

interface Tag {
  label: string
  link: {
    href: string
    target?: string
  }
}

interface Image {
  src: string
  alt: string
}

export interface BlogPost {
  title: string
  author?: string | null
  date: string
  tags?: Tag[] | null
  content?: string | null
  image?: Image | null
}

export interface BlogPostContentProps {
  blogPost: Streamable<BlogPost>
  breadcrumbs?: Streamable<Breadcrumb[]>
  className?: string
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --blog-post-content-font-family: var(--font-family-body);
 *   --blog-post-content-title-font-family: var(--font-family-body);
 *   --blog-post-content-title: var(--foreground);
 *   --blog-post-content-image-background: var(--contrast-100);
 * }
 * ```
 */
export function BlogPostContent({
  blogPost: streamableBlogPost,
  className = '',
  breadcrumbs,
}: BlogPostContentProps) {
  return (
    <SectionLayout className={clsx('group/blog-post-content', className)}>
      <div>
        <Stream fallback={<BlogPostContentSkeleton />} value={streamableBlogPost}>
          {blogPost => {
            const { title, author, date, tags, content, image } = blogPost

            return (
              <>
                <header className="mx-auto w-full max-w-4xl pb-8 font-[family-name:var(--blog-post-content-info-font-family,var(--font-family-body))] @2xl:pb-12 @4xl:pb-16">
                  {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
                  <h1 className="mt-8 mb-4 font-[family-name:var(--blog-post-content-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium text-(--blog-post-content-title,var(--foreground)) @xl:text-5xl @4xl:text-6xl">
                    {title}
                  </h1>
                  <p>
                    {date}{' '}
                    {author !== null && (
                      <>
                        <span className="px-1">•</span> {author}
                      </>
                    )}
                  </p>
                  {tags && tags.length > 0 && (
                    <div className="mt-4 -ml-1 flex flex-wrap gap-1.5 @xl:mt-6">
                      {tags.map(tag => (
                        <ButtonLink
                          href={tag.link.href}
                          key={tag.link.href}
                          size="small"
                          variant="tertiary"
                        >
                          {tag.label}
                        </ButtonLink>
                      ))}
                    </div>
                  )}
                </header>
                {image && (
                  <Image
                    alt={image.alt}
                    className="mb-8 aspect-video w-full rounded-2xl bg-(--blog-post-content-image-background,var(--contrast-100)) object-cover @2xl:mb-12 @4xl:mb-16"
                    height={780}
                    src={image.src}
                    width={1280}
                  />
                )}
                {content && (
                  <article
                    className="prose-xl mx-auto w-full max-w-4xl space-y-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </>
            )
          }}
        </Stream>
      </div>
    </SectionLayout>
  )
}

export function BlogPostContentSkeleton({ className }: Pick<BlogPostContentProps, 'className'>) {
  return (
    <Skeleton.Root
      className={clsx('group-has-[[data-pending]]/blog-post-content:animate-pulse', className)}
      pending
    >
      <div className="mx-auto w-full max-w-4xl pb-8 @2xl:pb-12 @4xl:pb-16">
        <BreadcrumbsSkeleton />
        <div className="mt-8 mb-4">
          <Skeleton.Text
            characterCount={60}
            className="rounded-lg text-4xl @xl:text-5xl @4xl:text-6xl"
          />
        </div>
        <div>
          <Skeleton.Box className="h-6 w-1/4 rounded-lg" />
        </div>
        <div className="mt-4 flex w-2/6 min-w-[250px] flex-wrap gap-3 @xl:mt-6">
          <Skeleton.Box className="h-10 w-16 rounded-full" />
          <Skeleton.Box className="h-10 w-14 rounded-full" />
          <Skeleton.Box className="h-10 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton.Box className="mb-8 aspect-video w-full rounded-2xl @2xl:mb-12 @4xl:mb-16" />
      <div className="mx-auto w-full max-w-4xl space-y-8 pb-8 text-xl @2xl:pb-12 @4xl:pb-16">
        <Skeleton.Text characterCount={60} className="rounded-lg" />
        <div className="space-y-4 text-lg">
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount="full" className="rounded-lg" />
          <Skeleton.Text characterCount={50} className="rounded-lg" />
        </div>
      </div>
    </Skeleton.Root>
  )
}

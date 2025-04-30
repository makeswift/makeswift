'use client'

import { usePathname } from 'next/navigation'

export function useSlug(): string | undefined {
  const pathname = usePathname()
  const slug = pathname.split('/').pop()

  return slug
}

'use client'

import { usePathname } from 'next/navigation'

export function useSlug(): string | undefined {
  const pathname = usePathname()
  const slug = pathname.split('/').pop()

  return slug
}

export function stringToURL(param: string) {
  return param.toLowerCase().replace(/\s+/g, '-').toLowerCase()
}

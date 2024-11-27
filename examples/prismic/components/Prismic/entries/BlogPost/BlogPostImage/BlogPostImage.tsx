import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/prismic/utils'

import { PrismicImage } from '../../../common/PrismicImage'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof PrismicImage>, 'field' | 'key'>

export function BlogPostImage({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'Blogpost' })

  return <PrismicImage {...rest} field={field} data-testid="blog_featured_image" />
}

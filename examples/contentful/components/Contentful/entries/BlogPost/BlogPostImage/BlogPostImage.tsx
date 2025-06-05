import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/contentful/utils'

import { ContentfulImage } from '../../../common/ContentfulImage'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof ContentfulImage>, 'field' | 'key'>

export function BlogPostImage({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogPost' })

  return <ContentfulImage {...rest} field={field} data-testid="blog_featured_image" />
}

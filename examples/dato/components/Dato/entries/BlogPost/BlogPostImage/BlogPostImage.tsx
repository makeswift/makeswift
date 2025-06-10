import { ComponentPropsWithoutRef } from 'react'

import DatoImage from '@/components/Dato/common/DatoImage/DatoImage'
import { useEntryField } from '@/lib/dato/utils'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof DatoImage>, 'field' | 'key'>

export function BlogPostImage({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoImage {...rest} field={field} data-testid="blog_featured_image" />
}

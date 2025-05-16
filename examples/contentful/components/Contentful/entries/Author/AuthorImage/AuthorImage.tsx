import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/contentful/utils'

import { ContentfulImage } from '../../../common/ContentfulImage'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof ContentfulImage>, 'field' | 'key'>

export function AuthorImage({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath })

  return <ContentfulImage {...rest} field={field} data-testid="author_avatar" />
}

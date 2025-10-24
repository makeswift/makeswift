import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/contentful/hooks'

import { ContentfulText } from '../../../common/ContentfulText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof ContentfulText>, 'field'>

export function BlogPostText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogPost' })

  return <ContentfulText {...rest} field={field} />
}

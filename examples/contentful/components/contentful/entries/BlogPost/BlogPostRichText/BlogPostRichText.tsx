import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/contentful/hooks'

import { ContentfulRichText } from '../../../common/ContentfulRichText/ContentfulRichText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof ContentfulRichText>, 'field'>

export function BlogPostRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogPost' })

  return <ContentfulRichText {...rest} field={field} />
}

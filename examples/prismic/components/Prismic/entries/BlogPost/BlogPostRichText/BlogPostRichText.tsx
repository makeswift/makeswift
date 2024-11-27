import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/prismic/utils'

import { PrismicRichText } from '../../../common/PrismicRichText/PrismicRichText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof PrismicRichText>, 'field'>

export function BlogPostRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'Blogpost' })

  return <PrismicRichText {...rest} field={field} />
}

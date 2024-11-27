import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/prismic/utils'

import { PrismicText } from '../../../common/PrismicText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof PrismicText>, 'field'>

export function BlogPostText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'Blogpost' })

  return <PrismicText {...rest} field={field} />
}

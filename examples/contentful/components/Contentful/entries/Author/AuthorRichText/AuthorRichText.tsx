import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/contentful/utils'

import { ContentfulRichText } from '../../../common/ContentfulRichText/ContentfulRichText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof ContentfulRichText>, 'field'>

export function AuthorRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath })

  return <ContentfulRichText {...rest} field={field} />
}

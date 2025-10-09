import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/dato/hooks'

import { DatoRichText } from '../../../common/DatoRichText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof DatoRichText>, 'field'>

export function BlogPostRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoRichText {...rest} field={field} />
}

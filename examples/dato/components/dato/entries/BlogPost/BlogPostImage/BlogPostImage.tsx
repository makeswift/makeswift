import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/dato/hooks'

import { DatoImage } from '../../../common/DatoImage'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof DatoImage>, 'field'>

export function BlogPostImage({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoImage {...rest} field={field} />
}

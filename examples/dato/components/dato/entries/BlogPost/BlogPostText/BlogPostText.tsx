import { ComponentPropsWithoutRef } from 'react'

import { useEntryField } from '@/lib/dato/hooks'

import { DatoText } from '../../../common/DatoText'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof DatoText>, 'field'>

export function BlogPostText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoText {...rest} field={field} />
}

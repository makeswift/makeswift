import { ComponentPropsWithoutRef } from 'react'

import { DatoText } from '@/components/dato/common/DatoText/DatoText'
import { useEntryField } from '@/lib/dato/hooks'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof DatoText>, 'field'>

export function BlogPostText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoText {...rest} field={field} />
}

import { DatoRichText } from '@/components/Dato/common/DatoRichText/DatoRichText'

import { useEntryField } from '../BlogPost.hooks'

type BaseProps = {
  fieldPath?: string
  className?: string
}

type Props = BaseProps & Omit<typeof DatoRichText, 'field'>

export function BlogRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath })

  return <DatoRichText {...rest} field={field} />
}

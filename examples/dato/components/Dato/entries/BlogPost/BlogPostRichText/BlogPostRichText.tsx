import { DatoRichText } from '@/components/Dato/common/DatoRichText/DatoRichText'
import { useEntryField } from '@/lib/dato/utils'

type BaseProps = {
  fieldPath?: string
}

type Props = BaseProps & Omit<Parameters<typeof DatoRichText>[0], 'field'>

export function BlogPostRichText({ fieldPath, ...rest }: Props) {
  const field = useEntryField({ fieldPath, type: 'BlogpostRecord' })

  return <DatoRichText {...rest} field={field} />
}

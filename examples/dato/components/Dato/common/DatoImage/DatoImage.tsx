import { Image, ImagePropTypes } from 'react-datocms'

import { Warning } from '@/components/Warning'
import { ResolvedField, isDatoImage } from '@/lib/dato/utils'

type Props = {
  className?: string
  field: ResolvedField
} & Omit<ImagePropTypes, 'data'>

export default function DatoImage({ className, field, ...rest }: Props) {
  if ('error' in field) {
    return <Warning className={className}>{field.error}</Warning>
  }

  if (field.data === null) {
    return <Warning className={className}>Image data is null.</Warning>
  }

  if (!isDatoImage(field.data)) {
    return <Warning className={className}>Image data is not compatible.</Warning>
  }

  return (
    <div className={className}>
      <Image data={field.data} {...rest} />
    </div>
  )
}

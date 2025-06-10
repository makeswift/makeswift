import { CSSProperties } from 'react'
import { Image, ImagePropTypes } from 'react-datocms'

import { ResolvedField, isDatoImage } from '@/lib/dato/utils'

type Props = {
  className?: string
  field: ResolvedField
} & ImagePropTypes

export default function DatoImage({ className, field, ...rest }: Props) {
  if ('error' in field) {
    return <span>{field.error}</span>
  }

  if (field.data === null) {
    return null
  }

  if (!isDatoImage(field.data)) {
    return <span>Image data is not compatible.</span>
  }

  return (
    <div className={className}>
      <Image data={field.data} {...rest} />
    </div>
  )
}

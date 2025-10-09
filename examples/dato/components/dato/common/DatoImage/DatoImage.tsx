import Image, { ImageProps } from 'next/image'

import clsx from 'clsx'

import { Warning } from '@/components/warning'
import { type ResolvedField, isFileField } from '@/lib/dato/utils'

type Props = {
  className?: string
  field: ResolvedField
  square?: boolean
  key?: string
} & Partial<ImageProps>

export function DatoImage({ className, field, square, ...rest }: Props) {
  if ('error' in field) {
    return <Warning className={className}>{field.error}</Warning>
  }

  if (!isFileField(field.data)) {
    return <Warning className={className}>Field is not a file.</Warning>
  }

  const image = field.data.responsiveImage

  if (!image?.src) {
    return <Warning className={className}>Image is missing src.</Warning>
  }

  return (
    <Image
      {...rest}
      className={clsx(className, square && 'aspect-square object-cover')}
      src={image.src}
      alt={image.alt ?? image.title ?? 'No alt text provided.'}
      width={image.width ?? 200}
      height={image.height ?? 200}
    />
  )
}

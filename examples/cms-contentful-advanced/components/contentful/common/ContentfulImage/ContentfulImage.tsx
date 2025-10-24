import Image, { ImageProps } from 'next/image'

import clsx from 'clsx'

import { Warning } from '@/components/Warning'
import { type ResolvedField, isAsset } from '@/lib/contentful/utils'

type Props = {
  className?: string
  field: ResolvedField
  square?: boolean
  key?: string
} & Partial<ImageProps>

export function ContentfulImage({ className, field, square, ...rest }: Props) {
  if ('error' in field) {
    return <Warning className={className}>{field.error}</Warning>
  }

  if (!isAsset(field.data)) {
    return <Warning className={className}>Field is not an asset.</Warning>
  }

  if (!field.data.url) {
    return <Warning className={className}>Asset is missing URL.</Warning>
  }

  return (
    <Image
      {...rest}
      className={clsx(className, square && 'aspect-square object-cover')}
      src={field.data.url}
      alt={field.data.title ?? 'No alt text provided.'}
      width={field.data.width ?? 200}
      height={field.data.height ?? 200}
    />
  )
}

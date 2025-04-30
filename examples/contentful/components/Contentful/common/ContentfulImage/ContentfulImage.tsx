import Image, { ImageProps } from 'next/image'

import clsx from 'clsx'
import { isDevelopment } from 'utils/isDevelopment'

import { Warning } from '@/components/Warning'

import { ResolvedField, isAsset } from '../../../../lib/contentful/utils'

type Props = {
  className?: string
  field: ResolvedField
  square?: boolean
  key?: string
} & Partial<ImageProps>

export function ContentfulImage({ className, field, square, ...rest }: Props) {
  if ('error' in field) {
    if (isDevelopment()) return <Warning className={className}>{field.error}</Warning>
    return null
  }

  if (!isAsset(field.data)) {
    if (isDevelopment()) return <Warning className={className}>Field is not an asset.</Warning>
    return null
  }

  if (!field.data.url) {
    if (isDevelopment()) return <Warning className={className}>Asset is missing URL.</Warning>
    return null
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

import { ImageProps } from 'next/image'

import { ImageFieldImage } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import clsx from 'clsx'
import { isDevelopment } from 'utils/isDevelopment'

import { Warning } from '@/components/Warning'

import { ResolvedField, isPrismicImage } from '../../../../lib/prismic/utils'

type Props = {
  className?: string
  field: ResolvedField
  square?: boolean
  key?: string
  alt?: string
} & Partial<ImageProps>

export function PrismicImage({ className, field, square, alt, ...rest }: Props) {
  if ('error' in field) {
    if (isDevelopment()) return <Warning className={className}>{field.error}</Warning>
    return null
  }

  if (!isPrismicImage(field.data)) {
    if (isDevelopment())
      return <Warning className={className}>Field is not a valid Prismic image.</Warning>
    return null
  }

  if (!field.data.url) {
    if (isDevelopment()) return <Warning className={className}>Asset is missing URL.</Warning>
    return null
  }

  return (
    <PrismicNextImage
      {...rest}
      className={clsx(className, square && 'aspect-square object-cover')}
      field={field.data}
    />
  )
}

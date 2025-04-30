import clsx from 'clsx'
import { isDevelopment } from 'utils/isDevelopment'

import { Warning } from '@/components/Warning'

import { ResolvedField } from '../../../../lib/contentful/utils'

type Props = {
  className?: string
  field: ResolvedField
  color?: string
  lineHeight?: number
  alignment?: 'left' | 'center' | 'right' | 'justify'
  slugFieldPath?: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ContentfulText({
  className,
  field,
  color,
  lineHeight,
  alignment = 'left',
  as: Component = 'p',
}: Props) {
  if ('error' in field) {
    if (isDevelopment()) return <Warning className={className}>{field.error}</Warning>
    return null
  }

  if (typeof field.data !== 'string') {
    if (isDevelopment()) return <Warning className={className}>Text is not a string.</Warning>
    return null
  }

  return (
    <Component
      className={clsx(
        'min-h-[14px]',
        className,
        {
          left: 'text-left',
          right: 'text-right',
          center: 'text-center',
          justify: 'text-justify',
        }[alignment]
      )}
      style={{ color, lineHeight }}
    >
      {field.data}
    </Component>
  )
}

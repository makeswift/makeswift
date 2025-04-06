import { forwardRef } from 'react'

import clsx from 'clsx'

import { ResolvedField } from '@/lib/dato/utils'

type Props = {
  className?: string
  field: ResolvedField
  alignment?: 'left' | 'center' | 'right' | 'justify'
  textColor?: string
  lineHeight?: number
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  prefix?: string
  suffix?: string
}

export const DatoText = forwardRef(function DatoText({
  className,
  field,
  alignment = 'left',
  textColor,
  lineHeight,
  as: Component = 'p',
  prefix,
  suffix,
}: Props) {
  if ('error' in field) {
    return <p className={className}>{`${field.error}`}</p>
  }

  if (typeof field.data !== 'string') {
    return <p className={className}>{`Field data is not a string.`}</p>
  }

  return (
    <Component
      className={clsx(
        `min-h-[14px]`,
        className,
        {
          left: 'text-left',
          right: 'text-right',
          center: 'text-center',
          justify: 'text-justify',
        }[alignment],
      )}
      style={{ lineHeight, color: textColor }}
    >
      {prefix} {field.data} {suffix}
    </Component>
  )
})

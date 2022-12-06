import { ReactNode } from 'react'

import { Locale } from 'lib/locale'

import { usePreviewableLocale } from './locale-context'

type Props = {
  className?: string
  previewLocale?: Locale
  english?: ReactNode
  spanish?: ReactNode
}

export function LocaleProvider({ className, previewLocale, english, spanish }: Props) {
  const locale = usePreviewableLocale(previewLocale)

  let content: ReactNode = null
  switch (locale) {
    case Locale.English:
      content = english
      break

    case Locale.Spanish:
      content = spanish
      break

    default:
      content = english
  }

  return <div className={className}>{content}</div>
}

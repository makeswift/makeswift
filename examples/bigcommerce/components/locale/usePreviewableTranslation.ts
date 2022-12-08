import { DEFAULT_LOCALE, Locale } from 'lib/locale'
import { useTranslation } from 'next-i18next'
import { usePreviewableLocale } from './locale-context'

export function usePreviewableTranslation(namespace?: string) {
  const locale = usePreviewableLocale()
  const {
    i18n: { getFixedT },
  } = useTranslation()

  const t = getFixedT(locale ?? DEFAULT_LOCALE, namespace)

  return { t }
}

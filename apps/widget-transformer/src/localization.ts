import { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export type Locale = 'en-US' | 'fr-FR'
export let defaultLocale: Locale = 'en-US'
export let locales: Locale[] = ['en-US', 'fr-FR']

export function getLocale(request: NextRequest): Locale {
  const languages = new Negotiator({
    headers: Object.fromEntries(request.headers.entries()),
  }).languages()

  return (
    locales.find(
      (locale) => locale === match(languages, locales, defaultLocale),
    ) ?? defaultLocale
  )
}

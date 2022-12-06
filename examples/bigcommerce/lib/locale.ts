export const Locale = {
  English: 'en-US',
  Spanish: 'es',
} as const

export const DEFAULT_LOCALE: Locale = Locale.English

export type Locale = typeof Locale[keyof typeof Locale]

export function getLocaleLabel(locale: Locale): string {
  switch (locale) {
    case Locale.English:
      return 'English'

    case Locale.Spanish:
      return 'Español'

    default:
      return 'English'
  }
}

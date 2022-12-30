import { useRouter } from 'next/router'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { DEFAULT_LOCALE, Locale } from 'lib/locale'

const Context = createContext<[Locale | undefined, Dispatch<SetStateAction<Locale | undefined>>]>([
  DEFAULT_LOCALE,
  () => {},
])

type Props = {
  children: ReactNode
}

export function PreviewableLocaleProvider({ children }: Props) {
  const router = useRouter()
  const localePreviewState = useState(router.locale as Locale | undefined)

  return <Context.Provider value={localePreviewState}>{children}</Context.Provider>
}

export function usePreviewableLocale(previewLocale?: Locale | undefined): Locale | undefined {
  const router = useRouter()
  const [previewableLocale, setPreviewLocale] = useContext(Context)
  const lastPreviewLocale = useRef(previewLocale)
  const lastPreviewableLocale = useRef(router.locale)

  useEffect(() => {
    if (lastPreviewLocale.current !== previewLocale) {
      lastPreviewLocale.current = previewLocale

      setPreviewLocale(previewLocale)
    }
  }, [previewLocale, setPreviewLocale])

  useEffect(() => {
    if (lastPreviewableLocale.current !== router.locale) {
      lastPreviewableLocale.current = router.locale as Locale | undefined

      setPreviewLocale(router.locale as Locale | undefined)
    }
  }, [router.locale, setPreviewLocale])

  return previewableLocale
}

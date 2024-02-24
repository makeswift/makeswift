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

type PreviewableLocale = Locale | undefined

const Context = createContext<[PreviewableLocale, Dispatch<SetStateAction<PreviewableLocale>>]>([
  DEFAULT_LOCALE,
  () => {},
])

type Props = {
  children: ReactNode
}

export function PreviewableLocaleProvider({ children }: Props) {
  const router = useRouter()
  const localePreviewState = useState(router.locale as PreviewableLocale)

  return <Context.Provider value={localePreviewState}>{children}</Context.Provider>
}

export function usePreviewableLocale(previewLocale?: PreviewableLocale): PreviewableLocale {
  const router = useRouter()
  const [previewableLocale, setPreviewableLocale] = useContext(Context)
  const lastPreviewLocale = useRef(previewLocale)
  const lastPreviewableLocale = useRef(previewableLocale)

  useEffect(() => {
    if (lastPreviewLocale.current !== previewLocale) {
      lastPreviewLocale.current = previewLocale
      setPreviewableLocale(previewLocale)
    }
  }, [previewLocale, setPreviewableLocale])

  useEffect(() => {
    const previewableLocale = router.locale as PreviewableLocale

    if (lastPreviewableLocale.current !== router.locale) {
      lastPreviewableLocale.current = previewableLocale
      setPreviewableLocale(previewableLocale)
    }
  }, [router.locale, setPreviewableLocale])

  return previewableLocale
}

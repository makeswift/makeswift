import { Listbox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'

import { DEFAULT_LOCALE, getLocaleLabel, Locale } from 'lib/locale'

import { usePreviewableLocale } from './locale-context'
import { useIsOnline } from 'lib/useIsOnline'

type Props = {
  className?: string
  previewLocale?: Locale
  disabled?: boolean
}

export function LocaleSwitcher({ className, previewLocale, disabled }: Props) {
  const router = useRouter()
  const { locales } = router
  const isOnline = useIsOnline()
  const activeLocale = usePreviewableLocale(previewLocale) ?? DEFAULT_LOCALE

  return (
    <div className={className}>
      <Listbox
        value={activeLocale}
        onChange={locale => {
          router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale })
        }}
        disabled={disabled || !isOnline}
      >
        <div className="relative text-base">
          <Listbox.Button
            disabled={disabled || !isOnline}
            className="relative flex justify-center items-center space-x-2 w-full cursor-pointer bg-white py-2 px-3 text-left disabled:cursor-not-allowed"
          >
            <span className="block truncate">{getLocaleLabel(activeLocale)}</span>{' '}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-[1px]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7071 4.29289C11.0976 4.68342 11.0976 5.31658 10.7071 5.70711L6.70711 9.70711C6.51957 9.89464 6.26522 10 6 10C5.73478 10 5.48043 9.89464 5.29289 9.70711L1.29289 5.70711C0.902369 5.31658 0.902369 4.68342 1.29289 4.29289C1.68342 3.90237 2.31658 3.90237 2.70711 4.29289L6 7.58579L9.29289 4.29289C9.68342 3.90237 10.3166 3.90237 10.7071 4.29289Z"
                fill="black"
              />
            </svg>
          </Listbox.Button>
          <Transition
            className="absolute z-10"
            enter="transition duration-200 ease-out"
            enterFrom="transform translate-y-2 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-175 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-2 opacity-0"
          >
            <Listbox.Options className="translate-y-2 min-w-[160px] w-full overflow-auto bg-white py-1 shadow-[0px_4px_16px_0px_#00000026] outline-none">
              {locales?.map((locale, localeIdx) => (
                <Listbox.Option
                  key={localeIdx}
                  className={({ selected, active }) =>
                    `select-none py-2 px-3 cursor-pointer ${active ? 'bg-peach' : 'bg-white'} ${
                      selected ? 'font-bold' : 'font-normal'
                    }`
                  }
                  value={locale}
                >
                  <span className={`block truncate`}>{getLocaleLabel(locale as Locale)}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

import 'lib/makeswift/register-components'

import { Header } from 'components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DEFAULT_LOCALE, Locale } from 'lib/locale'
import { NextPageContext } from 'next'

/**
 * These values prevent `useTranslation` from throwing in our header.
 * I didn't use getStaticProps because when offline it throws an error (failed to fetch) which the prevents the `reload` fix from working in our error page.
 * (ticket here: https://github.com/shadowwalker/next-pwa/issues/440)
 */
export async function getServerSideProps(ctx: NextPageContext) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? DEFAULT_LOCALE, ['offline'], null, [
        Locale.English,
        Locale.Spanish,
      ])),
    },
  }
}

export default function OfflinePage() {
  return (
    <div className="max-w-[1400px] mx-auto p-5">
      <Header links={[]} localeSwitcherDisabled={true} cartDisabled={true} />
      <div className="flex justify-center items-center flex-col mt-48 mx-auto space-y-6">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.3961 24.8814C16.305 25.0449 16.2156 25.2094 16.1279 25.3749C6.93472 27.1793 0 35.2782 0 45C0 56.0457 8.95433 65 20 65H56.5147L52.5147 61H20C11.1635 61 4 53.8366 4 45C4 36.9324 9.97289 30.2564 17.7372 29.1585C18.3988 29.065 18.97 28.6472 19.2596 28.0451C19.2921 27.9776 19.3248 27.9103 19.3579 27.8432L16.3961 24.8814ZM68.341 59.8557C72.8569 57.8181 76 53.2761 76 48C76 41.2647 70.8764 35.7237 64.3155 35.0656C63.4409 34.9778 62.7261 34.3293 62.5539 33.4673C60.45 22.9353 51.1495 15 40 15C35.3079 15 30.9429 16.405 27.3037 18.8185L24.4268 15.9415C28.8265 12.8295 34.199 11 40 11C52.598 11 63.1772 19.6263 66.16 31.2935C74.0397 32.7754 80 39.6905 80 48C80 54.3681 76.4986 59.9184 71.3159 62.8307L68.341 59.8557Z"
            fill="#335510"
          />
          <path d="M8 8L72 72" stroke="#335510" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <h1 className="text-2xl font-light text-black text-center max-w-[284px]">
          Only previously visited pages are available offline
        </h1>
      </div>
    </div>
  )
}

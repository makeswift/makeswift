import { draftMode } from 'next/headers'
import Script from 'next/script'
import { ActionTypes } from '../../react'

type Props = {
  appOrigin?: string
}

export async function DraftModeScript({ appOrigin = 'https://app.makeswift.com' }: Props) {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  const draftModeScript = `
const isDraft = ${isDraftModeEnabled}
const appOrigin = '${appOrigin.replace("'", "\\'")}'
const searchParamName = 'x-makeswift-draft-mode'
const headerName = 'X-Makeswift-Draft-Mode'
const originalUrl = new URL(window.location.href)

if (window.parent !== window) {
  window.addEventListener('message', event => {
    if (event.origin === appOrigin && event.data.type === 'makeswift_draft_mode') {
      const { secret } = event.data

      if (!isDraft && !originalUrl.searchParams.has(searchParamName)) {
        const url = new URL(originalUrl)

        url.searchParams.set(searchParamName, secret)

        window.location.replace(url)
      } else {
        const originalFetch = window.fetch

        window.fetch = function patchedFetch(resource, options) {
          const request = new Request(resource, options)

          if (new URL(request.url).origin !== window.location.origin) {
            return originalFetch.call(this, resource, options)
          }

          const newHeaders = new Headers(request.headers)
          newHeaders.set(headerName, secret)

          return originalFetch.call(
            this,
            new Request(request, { headers: newHeaders })
          )
        }
      }
    }
  })

  window.parent.postMessage({ type: 'makeswift_draft_mode' }, appOrigin)
}

if (originalUrl.searchParams.has(searchParamName)) {
  const url = new URL(originalUrl)

  url.searchParams.delete(searchParamName)

  window.history.replaceState(null, '', url)
}
`

  const makeswiftConnectionCheckScript = `
const appOrigin = '${appOrigin.replace("'", "\\'")}'

if (window.parent !== window) {
  window.addEventListener('message', event => {
    if (
      event.origin === appOrigin && 
      event.data.type === '${ActionTypes.MAKESWIFT_CONNECTION_INIT}'
    ) {
      setInterval(() => {
        window.parent.postMessage({ 
          type: '${ActionTypes.MAKESWIFT_CONNECTION_CHECK}',
          payload: { 
            currentUrl: window.location.href 
          }
        }, appOrigin)
      }, 20)
    }
  })

  window.parent.postMessage({ type: '${ActionTypes.MAKESWIFT_CONNECTION_INIT}' }, appOrigin)
}
`

  return (
    <>
      <Script
        id="makeswift-draft-mode"
        type="module"
        dangerouslySetInnerHTML={{ __html: draftModeScript }}
      />
      <Script
        id="makeswift-connection-check"
        type="module"
        dangerouslySetInnerHTML={{ __html: makeswiftConnectionCheckScript }}
      />
    </>
  )
}

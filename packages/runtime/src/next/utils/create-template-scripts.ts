import { ActionTypes } from '../../react'
import { PostMessageType } from './post-message'

export function getDraftScriptLiteral({
  isDraft,
  appOrigin,
  draftSearchParamName,
  draftHeaderName,
  draftBuilderHandshakeType,
}: {
  isDraft: boolean
  appOrigin: string
  draftSearchParamName: string
  draftHeaderName: string
  draftBuilderHandshakeType: string
}): string {
  const script = /* javascript */ `
const isDraft = ${isDraft}
const appOrigin = '${appOrigin.replace("'", "\\'")}'
const searchParamName = '${draftSearchParamName}'
const headerName = '${draftHeaderName}'
const originalUrl = new URL(window.location.href)

if (window.parent !== window) {
  window.addEventListener('message', event => {
    if (!(event.origin === appOrigin && event.data.type === '${draftBuilderHandshakeType}')) {
      return
    }
    
    const { secret } = event.data

    if (!isDraft && !originalUrl.searchParams.has(searchParamName)) {
      const url = new URL(originalUrl)
      url.searchParams.set(searchParamName, secret)
      window.location.replace(url)
      return
    }

    const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    function canSetCookie(cookieString) {
      originalCookie.set.call(document, cookieString)
      const result = document.cookie.includes(cookieString)
      // TODO: clear the cookie from the document
      const expiry = new Date(0).toString()
      originalCookie.set.call(document, cookieString + "; expiration=" + expiry)
      return result
    }

    function cookiesAtRisk() {
      const firstPartyCookieRisk = canSetCookie("makeswiftFirstPartyCookie=makeswiftFirstPartyCookie")
      const thirdPartyPartitionedRisk = canSetCookie("makeswiftThirdPartyCookie=makeswiftThirdPartyCookie; Secure; Partitioned;")
      const thirdPartyRisk = canSetCookie("makeswiftThirdPartyCookie=makeswiftThirdPartyCookie; Secure; SameSite=None;")
      // TODO: which of these do we need to test here?
      return firstPartyCookieRisk || thirdPartyPartitionedRisk || thirdPartyRisk
    }

    Object.defineProperty(document, 'cookie', {
      get() {
        return originalCookie.get.call(document);
      },
      set(value) {
        originalCookie.set.call(document, value);

        if (value.includes('HttpOnly')) return
        
        const cookieName = value.split(';').at(0)?.split('=').at(0)?.trim();
        if (cookieName == null) return

        if (!document.cookie.includes(cookieName + "=")) {
          window.parent.postMessage({ 
            type: '${PostMessageType.CookieWriteAtRisk}'
            data: { version: 1, source: 'local_write' }
          })
        }
      }
    });
    
    const originalFetch = window.fetch

    window.fetch = async function patchedFetch(resource, options) {
      const request = new Request(resource, options)

      if (new URL(request.url).origin !== window.location.origin) {
        if (cookiesAtRisk()) {
          window.parent.postMessage({ 
            type: '${PostMessageType.CookieWriteAtRisk}'
            data: { version: 1, source: 'cross_origin_request' }
          }, appOrigin)
        }
        return originalFetch.call(this, resource, options)
      }

      const newHeaders = new Headers(request.headers)
      newHeaders.set(headerName, secret)

      const response = await originalFetch.call(this, new Request(request, { headers: newHeaders }))
      if (cookiesAtRisk() && response.headers.has("X-Makeswift-Header-Risk")) {
        window.parent.postMessage({ 
          type: '${PostMessageType.CookieWriteAtRisk}'
          data: { version: 1, source: 'same_site_request' }
        }, appOrigin)
      }
      return response
    }
  })

  window.parent.postMessage({ type: '${draftBuilderHandshakeType}' }, appOrigin)
}

if (originalUrl.searchParams.has(searchParamName)) {
  const url = new URL(originalUrl)

  url.searchParams.delete(searchParamName)

  window.history.replaceState(null, '', url)
}
`
  return script
}

export function getConnectionCheckScriptLiteral(appOrigin: string): string {
  const script = /* javascript */ `
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
              payload: { currentUrl: window.location.href }
            }, appOrigin)
          }, 20)
        }
    })
  
    window.parent.postMessage({ type: '${ActionTypes.MAKESWIFT_CONNECTION_INIT}' }, appOrigin)
  }
`
  return script
}

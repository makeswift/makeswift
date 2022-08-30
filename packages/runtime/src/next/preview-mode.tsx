type Props = {
  isPreview?: boolean
  appOrigin?: string
}

export function PreviewModeScript({
  isPreview = false,
  appOrigin = 'https://app.makeswift.com',
}: Props) {
  const __html = `
const isPreview = ${isPreview}
const appOrigin = '${appOrigin.replace("'", "\\'")}'
const searchParamName = 'x-makeswift-preview-mode'
const headerName = 'X-Makeswift-Preview-Mode'
const originalUrl = new URL(window.location.href)

if (window.parent !== window) {
  window.addEventListener('message', event => {
    if (event.origin === appOrigin && event.data.type === 'makeswift_preview_mode') {
      const { secret } = event.data

      if (!isPreview && !originalUrl.searchParams.has(searchParamName)) {
        const url = new URL(originalUrl)

        url.searchParams.set(searchParamName, secret)

        window.location.replace(url)
      } else {
        const originalFetch = window.fetch

        window.fetch = function patchedFetch(input, init) {
          return originalFetch.call(this, input, {
            ...init,
            headers: { ...init?.headers, [headerName]: secret },
          })
        }
      }
    }
  })

  window.parent.postMessage({ type: 'makeswift_preview_mode' }, appOrigin)
}

if (originalUrl.searchParams.has(searchParamName)) {
  const url = new URL(originalUrl)

  url.searchParams.delete(searchParamName)

  window.history.replaceState(null, '', url)
}
`

  return <script id="makeswift-preview-mode" type="module" dangerouslySetInnerHTML={{ __html }} />
}

export type MakeswiftPreviewData = { makeswift: true }

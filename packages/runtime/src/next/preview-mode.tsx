import { PreviewData } from 'next'
import { z } from 'zod'
import { ActionTypes } from '../react'

const makeswiftSiteVersionSchema = z.enum(['Live', 'Working'])
export const MakeswiftSiteVersion = makeswiftSiteVersionSchema.Enum
export type MakeswiftSiteVersion = z.infer<typeof makeswiftSiteVersionSchema>

const makeswiftPreviewDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})
export type MakeswiftPreviewData = z.infer<typeof makeswiftPreviewDataSchema>

export function getMakeswiftSiteVersion(previewData: PreviewData): MakeswiftSiteVersion | null {
  const result = makeswiftPreviewDataSchema.safeParse(previewData)

  if (result.success) return result.data.siteVersion

  return null
}

type Props = {
  isPreview?: boolean
  appOrigin?: string
}

export function PreviewModeScript({
  isPreview = false,
  appOrigin = 'https://app.makeswift.com',
}: Props) {
  const previewModeScript = `
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

        window.fetch = function patchedFetch(resource, options) {
          const request = new Request(resource, options)

          if (new URL(request.url).origin !== window.location.origin) {
            return originalFetch.call(this, resource, options)
          }

          return originalFetch.call(
            this,
            new Request(request, { headers: { [headerName]: secret } }),
          )
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
      <script
        id="makeswift-preview-mode"
        type="module"
        dangerouslySetInnerHTML={{ __html: previewModeScript }}
      />
      <script
        id="makeswift-connection-check"
        type="module"
        dangerouslySetInnerHTML={{ __html: makeswiftConnectionCheckScript }}
      />
    </>
  )
}

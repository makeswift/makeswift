import { match } from 'ts-pattern'
import { z } from 'zod'

import { type PagePathnameSlice } from '../../resources'

import * as LinkSchema from './schema'

type LinkData = z.infer<typeof LinkSchema.data>
type LinkTarget = z.infer<typeof LinkSchema.target>
type ScrollOptions = z.infer<typeof LinkSchema.scrollOptions>

export function resolveLink(
  data: LinkData | undefined,
  page: PagePathnameSlice | null,
  elementId: string | null,
): { href: string; target?: LinkTarget; scrollOptions?: ScrollOptions } {
  return match(data)
    .with({ type: 'OPEN_PAGE' }, ({ payload }) => {
      const href =
        page != null ? `/${page.localizedPathname ?? page.pathname}` : '#'
      const target: LinkTarget = payload.openInNewTab ? '_blank' : '_self'
      return { href, target }
    })
    .with({ type: 'OPEN_URL' }, ({ payload }) => {
      const href = payload.url
      const target: LinkTarget = payload.openInNewTab ? '_blank' : '_self'
      return { href, target }
    })
    .with({ type: 'SEND_EMAIL' }, ({ payload }) => {
      const { to, subject = '', body = '' } = payload
      const href =
        to != null ? `mailto:${to}?subject=${subject}&body=${body}` : '#'
      return { href }
    })
    .with({ type: 'CALL_PHONE' }, ({ payload }) => {
      const href = `tel:${payload.phoneNumber}`
      return { href }
    })
    .with({ type: 'SCROLL_TO_ELEMENT' }, ({ payload }) => {
      const href = `#${elementId ?? ''}`
      const block = payload.block
      return { href, scrollOptions: { block } }
    })
    .otherwise(() => {
      throw new RangeError(`Invalid link type "${(data as any).type}".`)
    })
}

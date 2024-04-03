import { Options, Types } from './prop-controllers'

type OpenPageLink = {
  type: 'OPEN_PAGE'
  payload: { pageId: string | null | undefined; openInNewTab: boolean }
}

type OpenURLLink = {
  type: 'OPEN_URL'
  payload: { url: string; openInNewTab: boolean }
}

type SendEmailLink = {
  type: 'SEND_EMAIL'
  payload: { to: string; subject?: string; body?: string }
}

type CallPhoneLink = { type: 'CALL_PHONE'; payload: { phoneNumber: string } }

type ScrollToElementLink = {
  type: 'SCROLL_TO_ELEMENT'
  payload: {
    elementIdConfig: { elementKey: string; propName: string } | null | undefined
    block: 'start' | 'center' | 'end'
  }
}

export type Link =
  | OpenPageLink
  | OpenURLLink
  | SendEmailLink
  | CallPhoneLink
  | ScrollToElementLink

export type LinkValue = Link

export type LinkOptions = Options<{
  preset?: LinkValue
  label?: string
  defaultValue?: Link
  options?: { value: Link['type']; label: string }[]
  hidden?: boolean
}>

export type LinkDescriptor<_T = LinkValue> = {
  type: typeof Types.Link
  options: LinkOptions
}

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Link(options: LinkOptions = {}): LinkDescriptor {
  return { type: Types.Link, options }
}

type OpenPageLink = {
  type: 'OPEN_PAGE'
  payload: { pageId: string | null | undefined; openInNewTab: boolean }
}

type OpenURLLink = { type: 'OPEN_URL'; payload: { url: string; openInNewTab: boolean } }

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

export type LinkControlData =
  | OpenPageLink
  | OpenURLLink
  | SendEmailLink
  | CallPhoneLink
  | ScrollToElementLink

export const LinkControlType = 'makeswift::controls::link'

type LinkControlConfig = {
  label?: string
}

export type LinkControlDefinition<C extends LinkControlConfig = LinkControlConfig> = {
  type: typeof LinkControlType
  config: C
}

export function Link<C extends LinkControlConfig>(config: C = {} as C): LinkControlDefinition<C> {
  return { type: LinkControlType, config }
}

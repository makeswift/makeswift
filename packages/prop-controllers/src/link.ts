import { match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from './prop-controllers'

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

export type LinkPropControllerDataV0 = Link

export const LinkPropControllerDataV1Type = 'prop-controllers::link::v1'

export type LinkPropControllerDataV1 = {
  [ControlDataTypeKey]: typeof LinkPropControllerDataV1Type
  value: Link
}

export type LinkPropControllerData =
  | LinkPropControllerDataV0
  | LinkPropControllerDataV1

export type LinkOptions = Options<{
  preset?: LinkPropControllerData
  label?: string
  defaultValue?: Link
  options?: { value: Link['type']; label: string }[]
  hidden?: boolean
}>

type LinkDescriptorV0<
  _T = LinkPropControllerDataV0,
  U extends LinkOptions = LinkOptions,
> = {
  type: typeof Types.Link
  options: U
}

type LinkDescriptorV1<
  _T = LinkPropControllerData,
  U extends LinkOptions = LinkOptions,
> = {
  type: typeof Types.Link
  version: 1
  options: U
}

export type LinkDescriptor<
  _T = LinkPropControllerData,
  U extends LinkOptions = LinkOptions,
> = LinkDescriptorV0<_T, U> | LinkDescriptorV1<_T, U>

export type LinkPropControllerValue = Link

export function getLinkPropControllerValue(
  data: LinkPropControllerData,
): LinkPropControllerValue {
  return match(data)
    .with(
      { [ControlDataTypeKey]: LinkPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function getLinkPropControllerPageIds(
  linkData: LinkPropControllerData | null | undefined,
): string[] {
  if (linkData == null) return []

  const link = getLinkPropControllerValue(linkData)

  switch (link.type) {
    case 'OPEN_PAGE':
      return link.payload.pageId == null ? [] : [link.payload.pageId]

    default:
      return []
  }
}

export function copyLinkPropControllerData(
  data: LinkPropControllerData | undefined,
  context: CopyContext,
): LinkPropControllerData | undefined {
  if (data == null) return data

  let value = getLinkPropControllerValue(data)

  switch (value?.type) {
    case 'OPEN_PAGE':
      {
        const pageId = value.payload.pageId

        if (pageId == null) return value

        value = {
          ...value,
          payload: {
            ...value.payload,
            pageId: context.replacementContext.pageIds.get(pageId) ?? pageId,
          },
        }
      }
      break

    case 'SCROLL_TO_ELEMENT': {
      const elementIdConfig = value.payload.elementIdConfig

      if (elementIdConfig == null) return value

      value = {
        ...value,
        payload: {
          ...value.payload,
          elementIdConfig: {
            ...elementIdConfig,
            elementKey:
              context.replacementContext.elementKeys.get(
                elementIdConfig.elementKey,
              ) ?? elementIdConfig.elementKey,
          },
        },
      }
      break
    }
  }

  return match(data)
    .with({ [ControlDataTypeKey]: LinkPropControllerDataV1Type }, (v1) => ({
      ...v1,
      value,
    }))
    .otherwise((_) => value)
}

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Link(options: LinkOptions = {}): LinkDescriptor {
  return { type: Types.Link, version: 1, options }
}

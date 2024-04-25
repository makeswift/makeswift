import { match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from '../prop-controllers'

import { z } from 'zod'

const openPageLinkSchema = z.object({
  type: z.literal('OPEN_PAGE'),
  payload: z
    .object({
      pageId: z.string().nullable().optional(),
      openInNewTab: z.boolean(),
    })
    .transform((v) => ({
      pageId: v.pageId,
      ...v,
    })),
})

const openURLLinkSchema = z.object({
  type: z.literal('OPEN_URL'),
  payload: z.object({
    url: z.string(),
    openInNewTab: z.boolean(),
  }),
})

const sendEmailLinkSchema = z.object({
  type: z.literal('SEND_EMAIL'),
  payload: z.object({
    to: z.string(),
    subject: z.string().optional(),
    body: z.string().optional(),
  }),
})

const callPhoneLinkSchema = z.object({
  type: z.literal('CALL_PHONE'),
  payload: z.object({
    phoneNumber: z.string(),
  }),
})

const scrollToElementLinkSchema = z.object({
  type: z.literal('SCROLL_TO_ELEMENT'),
  payload: z
    .object({
      elementIdConfig: z
        .object({
          elementKey: z.string(),
          propName: z.string(),
        })
        .nullable()
        .optional(),
      block: z.union([
        z.literal('start'),
        z.literal('center'),
        z.literal('end'),
      ]),
    })
    .transform((v) => ({
      elementIdConfig: v.elementIdConfig,
      ...v,
    })),
})

export const linkDataSchema = z.union([
  openPageLinkSchema,
  openURLLinkSchema,
  sendEmailLinkSchema,
  callPhoneLinkSchema,
  scrollToElementLinkSchema,
])

export type LinkData = z.infer<typeof linkDataSchema>

export type LinkPropControllerDataV0 = LinkData

export const LinkPropControllerDataV1Type = 'prop-controllers::link::v1'

export type LinkPropControllerDataV1 = {
  [ControlDataTypeKey]: typeof LinkPropControllerDataV1Type
  value: LinkData
}

export type LinkPropControllerData =
  | LinkPropControllerDataV0
  | LinkPropControllerDataV1

type LinkOptions = Options<{
  preset?: LinkPropControllerData
  label?: string
  defaultValue?: LinkData
  options?: { value: LinkData['type']; label: string }[]
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

export type LinkPropControllerValue = LinkData

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

export function createLinkPropControllerDataFromLinkData(
  value: LinkData,
  definition: LinkDescriptor,
): LinkPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: LinkPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
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

export function copyLinkData(
  data: LinkData | undefined,
  context: CopyContext,
): LinkData | undefined {
  let value = data

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

  return value
}

export function copyLinkPropControllerData(
  data: LinkPropControllerData | undefined,
  context: CopyContext,
): LinkPropControllerData | undefined {
  if (data == null) return data

  const value = copyLinkData(getLinkPropControllerValue(data), context)

  if (value == null) return value

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

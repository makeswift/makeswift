import { match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from '../prop-controllers'

import {
  getReplacementPageId,
  LinkDefinition,
  shouldRemovePage,
} from '@makeswift/controls'

import { z } from 'zod'

export const linkDataSchema = LinkDefinition.schema.link

export type LinkData = z.infer<typeof linkDataSchema>

const linkPropControllerDataV0Schema = linkDataSchema

export type LinkPropControllerDataV0 = z.infer<
  typeof linkPropControllerDataV0Schema
>

export const LinkPropControllerDataV1Type = 'prop-controllers::link::v1'
const linkPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(LinkPropControllerDataV1Type),
  value: linkDataSchema,
})

export type LinkPropControllerDataV1 = z.infer<
  typeof linkPropControllerDataV1Schema
>

export const linkPropControllerDataSchema = z.union([
  linkPropControllerDataV0Schema,
  linkPropControllerDataV1Schema,
])

export type LinkPropControllerData = z.infer<
  typeof linkPropControllerDataSchema
>

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

export type ResolveLinkPropControllerValue<T extends LinkDescriptor> =
  T extends LinkDescriptor ? LinkData | undefined : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Link(options: LinkOptions = {}): LinkDescriptor {
  return { type: Types.Link, version: 1, options }
}

export function getLinkPropControllerDataLinkData(
  data: LinkPropControllerData,
): LinkData {
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
        }) as const,
    )
    .otherwise(() => value)
}

export function getLinkPropControllerPageIds(
  linkData: LinkPropControllerData | null | undefined,
): string[] {
  if (linkData == null) return []

  const link = getLinkPropControllerDataLinkData(linkData)

  switch (link.type) {
    case 'OPEN_PAGE':
      return link.payload.pageId == null ? [] : [link.payload.pageId]

    default:
      return []
  }
}

export function copyLinkData(
  data: LinkData | undefined,
  ctx: CopyContext,
): LinkData | undefined {
  let value = data

  switch (value?.type) {
    case 'OPEN_PAGE':
      {
        const pageId = value.payload.pageId

        if (pageId == null) return value
        if (shouldRemovePage(pageId, ctx)) return undefined

        value = {
          ...value,
          payload: {
            ...value.payload,
            pageId: getReplacementPageId(pageId, ctx) ?? pageId,
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
              ctx.replacementContext.elementKeys.get(
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

  const value = copyLinkData(getLinkPropControllerDataLinkData(data), context)

  if (value == null) return value

  return match(data)
    .with({ [ControlDataTypeKey]: LinkPropControllerDataV1Type }, (v1) => ({
      ...v1,
      value,
    }))
    .otherwise((_) => value)
}

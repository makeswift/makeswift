import { match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { z } from 'zod'
import { colorDataSchema } from '../data'
import { textStyleDataSchema } from '../text-style'
import { copyLinkData, linkDataSchema } from '../link'
import { copyResponsiveColorData } from '../responsive-color'

const buttonVariantSchema = z.enum([
  'flat',
  'outline',
  'shadow',
  'clear',
  'blocky',
  'bubbly',
  'skewed',
])

const buttonShapeSchema = z.enum(['pill', 'rounded', 'square'])

const buttonSizeSchema = z.enum(['small', 'medium', 'large'])

const navigationButtonSchema = z.object({
  id: z.string(),
  type: z.literal('button'),
  payload: z.object({
    label: z.string(),
    link: linkDataSchema.optional(),
    variant: Schema.responsiveValue(buttonVariantSchema).optional(),
    shape: Schema.responsiveValue(buttonShapeSchema).optional(),
    size: Schema.responsiveValue(buttonSizeSchema).optional(),
    textColor: Schema.responsiveValue(colorDataSchema).optional(),
    color: Schema.responsiveValue(colorDataSchema).optional(),
    textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
  }),
})

export type NavigationButtonData = z.infer<typeof navigationButtonSchema>

const navigationDropdownCaretTypeSchema = z.union([
  z.literal('caret'),
  z.literal('plus'),
  z.literal('arrow-down'),
  z.literal('chevron-down'),
])

const navigationDropdownLinkSchema = z.object({
  id: z.string(),
  payload: z.object({
    label: z.string(),
    link: linkDataSchema.optional(),
    color: Schema.responsiveValue(colorDataSchema).optional(),
    textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
  }),
})

const navigationDropdownSchema = z.object({
  id: z.string(),
  type: z.literal('dropdown'),
  payload: z.object({
    label: z.string(),
    caret: navigationDropdownCaretTypeSchema.optional(),
    links: z.array(navigationDropdownLinkSchema).optional(),
    variant: Schema.responsiveValue(buttonVariantSchema).optional(),
    shape: Schema.responsiveValue(buttonShapeSchema).optional(),
    size: Schema.responsiveValue(buttonSizeSchema).optional(),
    textColor: Schema.responsiveValue(colorDataSchema).optional(),
    color: Schema.responsiveValue(colorDataSchema).optional(),
    textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
  }),
})

export type NavigationDropdownData = z.infer<typeof navigationDropdownSchema>

const navigationLinksDataSchema = z.array(
  z.union([navigationButtonSchema, navigationDropdownSchema]),
)

export type NavigationLinksData = z.infer<typeof navigationLinksDataSchema>

const navigationLinksPropControllerDataV0Schema = navigationLinksDataSchema

export type NavigationLinksPropControllerDataV0 = z.infer<
  typeof navigationLinksPropControllerDataV0Schema
>

export const NavigationLinksPropControllerDataV1Type =
  'prop-controllers::navigation-links::v1'

const navigationLinksPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(NavigationLinksPropControllerDataV1Type),
  value: navigationLinksDataSchema,
})

export type NavigationLinksPropControllerDataV1 = z.infer<
  typeof navigationLinksPropControllerDataV1Schema
>

export const navigationLinksPropControllerDataSchema = z.union([
  navigationLinksPropControllerDataV0Schema,
  navigationLinksPropControllerDataV1Schema,
])

export type NavigationLinksPropControllerData = z.infer<
  typeof navigationLinksPropControllerDataSchema
>

type NavigationLinksOptions = Options<Record<string, never>>

type NavigationLinksDescriptorV0<
  _T = NavigationLinksPropControllerDataV0,
  U extends NavigationLinksOptions = NavigationLinksOptions,
> = {
  type: typeof Types.NavigationLinks
  options: U
}

type NavigationLinksDescriptorV1<
  _T = NavigationLinksPropControllerData,
  U extends NavigationLinksOptions = NavigationLinksOptions,
> = {
  type: typeof Types.NavigationLinks
  version: 1
  options: U
}

export type NavigationLinksDescriptor<
  _T = NavigationLinksPropControllerData,
  U extends NavigationLinksOptions = NavigationLinksOptions,
> = NavigationLinksDescriptorV0<_T, U> | NavigationLinksDescriptorV1<_T, U>

export type ResolveNavigationLinksPropControllerValue<
  T extends NavigationLinksDescriptor,
> = T extends NavigationLinksDescriptor
  ? NavigationLinksData | undefined
  : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function NavigationLinks(
  options: NavigationLinksOptions = {},
): NavigationLinksDescriptor<NavigationLinksPropControllerData> {
  return { type: Types.NavigationLinks, version: 1, options }
}

export function getNavigationLinksPropControllerDataNavigationLinksData(
  data: NavigationLinksPropControllerData | undefined,
): NavigationLinksData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createNavigationLinksPropControllerDataFromNavigationLinksData(
  navigationLinksData: NavigationLinksData,
  definition: NavigationLinksDescriptor,
): NavigationLinksPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: navigationLinksData,
        }) as const,
    )
    .otherwise(() => navigationLinksData)
}

export function getNavigationLinksPropControllerPageIds(
  data: NavigationLinksPropControllerData | null | undefined,
): string[] {
  if (data == null) return []

  const value = getNavigationLinksPropControllerDataNavigationLinksData(data)

  return (
    value?.flatMap((item) => {
      switch (item.type) {
        case 'button': {
          if (item.payload.link == null) return []

          switch (item.payload.link.type) {
            case 'OPEN_PAGE':
              return item.payload.link.payload.pageId == null
                ? []
                : [item.payload.link.payload.pageId]

            default:
              return []
          }
        }

        case 'dropdown': {
          return (
            item.payload.links?.flatMap((link) => {
              if (link.payload.link == null) return []

              switch (link.payload.link.type) {
                case 'OPEN_PAGE':
                  return link.payload.link.payload.pageId == null
                    ? []
                    : [link.payload.link.payload.pageId]

                default:
                  return []
              }
            }) ?? []
          )
        }
      }
    }) ?? []
  )
}

export function getNavigationLinksPropControllerSwatchIds(
  data: NavigationLinksPropControllerData | null | undefined,
): string[] {
  if (data == null) return []

  const value = getNavigationLinksPropControllerDataNavigationLinksData(data)

  return (
    value?.flatMap((item) => {
      switch (item.type) {
        case 'button':
        case 'dropdown':
          return [
            ...(item.payload.color
              ?.map((override) => override.value)
              .map((color) => color.swatchId) ?? []),
            ...(item.payload.textColor
              ?.map((override) => override.value)
              .map((color) => color.swatchId) ?? []),
          ]
      }
    }) ?? []
  )
}

function copyNavigationLinksData(
  data: NavigationLinksData,
  context: CopyContext,
): NavigationLinksData {
  return data?.map((item) => {
    switch (item.type) {
      case 'button': {
        const { color, link } = item.payload

        return {
          ...item,
          payload: {
            ...item.payload,
            link: copyLinkData(link, context),
            color:
              color != null
                ? copyResponsiveColorData(color, context)
                : undefined,
          },
        }
      }

      case 'dropdown': {
        const { color, links } = item.payload

        return {
          ...item,
          payload: {
            ...item.payload,
            links:
              links != null
                ? links.map((link) => ({
                    ...link,
                    payload: {
                      ...link.payload,
                      link: copyLinkData(link.payload.link, context),
                    },
                  }))
                : undefined,
            color:
              color != null
                ? copyResponsiveColorData(color, context)
                : undefined,
          },
        }
      }

      default:
        return item
    }
  })
}

export function copyNavigationLinksPropControllerData(
  data: NavigationLinksPropControllerData | undefined,
  context: CopyContext,
): NavigationLinksPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: copyNavigationLinksData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyNavigationLinksData(v0, context))
}

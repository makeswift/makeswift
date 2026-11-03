import { match } from 'ts-pattern'
import { ResourceSchema, type ColorDataV2 } from '@makeswift/controls'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { z } from 'zod'
import { colorDataSchema, type ColorData } from '../data'
import { textStyleDataSchema } from '../text-style'
import { copyLinkData, linkDataSchema } from '../link'
import {
  copyResponsiveColorData,
  getResponsiveColorDataSwatchIds,
  responsiveColorDataSchema,
  toResponsiveColorDataV1,
  toResponsiveColorDataV2,
  type ResponsiveColor,
  type ResponsiveColorData,
} from '../responsive-color'

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

const navigationDropdownCaretTypeSchema = z.union([
  z.literal('caret'),
  z.literal('plus'),
  z.literal('arrow-down'),
  z.literal('chevron-down'),
])

const navigationButtonSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    id: z.string(),
    type: z.literal('button'),
    payload: z.object({
      label: z.string(),
      link: linkDataSchema.optional(),
      variant: Schema.responsiveValue(buttonVariantSchema).optional(),
      shape: Schema.responsiveValue(buttonShapeSchema).optional(),
      size: Schema.responsiveValue(buttonSizeSchema).optional(),
      textColor: responsiveColorDataSchema(color).optional(),
      color: responsiveColorDataSchema(color).optional(),
      textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
    }),
  })

const navigationDropdownLinkSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    id: z.string(),
    payload: z.object({
      label: z.string(),
      link: linkDataSchema.optional(),
      color: responsiveColorDataSchema(color).optional(),
      textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
    }),
  })

const navigationDropdownSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    id: z.string(),
    type: z.literal('dropdown'),
    payload: z.object({
      label: z.string(),
      caret: navigationDropdownCaretTypeSchema.optional(),
      links: z.array(navigationDropdownLinkSchema(color)).optional(),
      variant: Schema.responsiveValue(buttonVariantSchema).optional(),
      shape: Schema.responsiveValue(buttonShapeSchema).optional(),
      size: Schema.responsiveValue(buttonSizeSchema).optional(),
      textColor: responsiveColorDataSchema(color).optional(),
      color: responsiveColorDataSchema(color).optional(),
      textStyle: Schema.responsiveValue(textStyleDataSchema).optional(),
    }),
  })

const navigationLinksDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.array(
    z.union([navigationButtonSchema(color), navigationDropdownSchema(color)]),
  )

type NavigationLinks<Color> = z.infer<
  ReturnType<typeof navigationLinksDataSchema<z.ZodType<Color>>>
>

export type NavigationLinksData = NavigationLinks<ColorDataV2>

export type NavigationButtonData = Extract<
  NavigationLinksData[number],
  { type: 'button' }
>

export type NavigationDropdownData = Extract<
  NavigationLinksData[number],
  { type: 'dropdown' }
>

type NavigationLinksDataV1 = NavigationLinks<ColorData>

const navigationLinksPropControllerDataV0Schema =
  navigationLinksDataSchema(colorDataSchema)

export type NavigationLinksPropControllerDataV0 = z.infer<
  typeof navigationLinksPropControllerDataV0Schema
>

export const NavigationLinksPropControllerDataV1Type =
  'prop-controllers::navigation-links::v1'

const navigationLinksPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(NavigationLinksPropControllerDataV1Type),
  value: navigationLinksDataSchema(colorDataSchema),
})

export type NavigationLinksPropControllerDataV1 = z.infer<
  typeof navigationLinksPropControllerDataV1Schema
>

/** v2 colors are either a swatch or an inline color */
export const NavigationLinksPropControllerDataV2Type =
  'prop-controllers::navigation-links::v2'

const navigationLinksPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(NavigationLinksPropControllerDataV2Type),
  value: navigationLinksDataSchema(ResourceSchema.colorDataV2),
})

export type NavigationLinksPropControllerDataV2 = z.infer<
  typeof navigationLinksPropControllerDataV2Schema
>

export const navigationLinksPropControllerDataSchema = z.union([
  navigationLinksPropControllerDataV0Schema,
  navigationLinksPropControllerDataV1Schema,
  navigationLinksPropControllerDataV2Schema,
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

type NavigationLinksDescriptorV2<
  _T = NavigationLinksPropControllerData,
  U extends NavigationLinksOptions = NavigationLinksOptions,
> = {
  type: typeof Types.NavigationLinks
  version: 2
  options: U
}

export type NavigationLinksDescriptor<
  _T = NavigationLinksPropControllerData,
  U extends NavigationLinksOptions = NavigationLinksOptions,
> =
  | NavigationLinksDescriptorV0<_T, U>
  | NavigationLinksDescriptorV1<_T, U>
  | NavigationLinksDescriptorV2<_T, U>

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
  return { type: Types.NavigationLinks, version: 2, options }
}

function mapNavigationLinksColors<From, To>(
  data: NavigationLinks<From>,
  callback: (color: ResponsiveColor<From>) => ResponsiveColor<To>,
): NavigationLinks<To>
// zod's types can't be narrowed while `Color` is a type parameter
function mapNavigationLinksColors(
  data: NavigationLinks<unknown>,
  callback: (color: ResponsiveColor<unknown>) => ResponsiveColor<unknown>,
): NavigationLinks<unknown> {
  const map = (color: ResponsiveColor<unknown> | undefined) =>
    color === undefined ? undefined : callback(color)

  return data.map((item) => {
    switch (item.type) {
      case 'button':
        return {
          ...item,
          payload: {
            ...item.payload,
            color: map(item.payload.color),
            textColor: map(item.payload.textColor),
          },
        }

      case 'dropdown':
        return {
          ...item,
          payload: {
            ...item.payload,
            color: map(item.payload.color),
            textColor: map(item.payload.textColor),
            links: item.payload.links?.map((link) => ({
              ...link,
              payload: { ...link.payload, color: map(link.payload.color) },
            })),
          },
        }
    }
  })
}

const toNavigationLinksDataV2 = (
  data: NavigationLinksDataV1,
): NavigationLinksData =>
  mapNavigationLinksColors<ColorData, ColorDataV2>(
    data,
    toResponsiveColorDataV2,
  )

const toNavigationLinksDataV1 = (
  data: NavigationLinksData,
): NavigationLinksDataV1 =>
  mapNavigationLinksColors<ColorDataV2, ColorData>(
    data,
    toResponsiveColorDataV1,
  )

export function getNavigationLinksPropControllerDataNavigationLinksData(
  data: NavigationLinksPropControllerData | undefined,
): NavigationLinksData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type },
      (v1) => toNavigationLinksDataV2(v1.value),
    )
    .otherwise((v0) => toNavigationLinksDataV2(v0))
}

export function createNavigationLinksPropControllerDataFromNavigationLinksData(
  navigationLinksData: NavigationLinksData,
  definition: NavigationLinksDescriptor,
): NavigationLinksPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV2Type,
          value: navigationLinksData,
        }) as const,
    )
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type,
          value: toNavigationLinksDataV1(navigationLinksData),
        }) as const,
    )
    .otherwise(() => toNavigationLinksDataV1(navigationLinksData))
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
  const swatchIds = (color: ResponsiveColorData | undefined) =>
    color == null ? [] : getResponsiveColorDataSwatchIds(color)

  return (
    value?.flatMap(({ type, payload }) => {
      switch (type) {
        case 'button':
          return [...swatchIds(payload.color), ...swatchIds(payload.textColor)]

        case 'dropdown':
          return [
            ...swatchIds(payload.color),
            ...swatchIds(payload.textColor),
            ...(payload.links?.flatMap((link) =>
              swatchIds(link.payload.color),
            ) ?? []),
          ]
      }
    }) ?? []
  )
}

function copyNavigationLinksData(
  data: NavigationLinksData,
  context: CopyContext,
): NavigationLinksData {
  const copyColor = (color: ResponsiveColorData | undefined) =>
    color != null ? copyResponsiveColorData(color, context) : undefined

  return data?.map((item) => {
    switch (item.type) {
      case 'button': {
        const { color, textColor, link } = item.payload

        return {
          ...item,
          payload: {
            ...item.payload,
            link: copyLinkData(link, context),
            color: copyColor(color),
            textColor: copyColor(textColor),
          },
        }
      }

      case 'dropdown': {
        const { color, textColor, links } = item.payload

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
                      color: copyColor(link.payload.color),
                    },
                  }))
                : undefined,
            color: copyColor(color),
            textColor: copyColor(textColor),
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
  const copy = (data: NavigationLinksDataV1) =>
    toNavigationLinksDataV1(
      copyNavigationLinksData(toNavigationLinksDataV2(data), context),
    )

  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV2Type },
      (v2) => ({ ...v2, value: copyNavigationLinksData(v2.value, context) }),
    )
    .with(
      { [ControlDataTypeKey]: NavigationLinksPropControllerDataV1Type },
      (v1) => ({ ...v1, value: copy(v1.value) }),
    )
    .otherwise((v0) => copy(v0))
}

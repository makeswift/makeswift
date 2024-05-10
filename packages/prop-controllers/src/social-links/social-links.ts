import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { P, match } from 'ts-pattern'

const socialLinkTypesV0 = [
  'angellist',
  'codepen',
  'discord',
  'dribbble',
  'facebook',
  'github',
  'instagram',
  'linkedin',
  'medium',
  'pinterest',
  'reddit',
  'rss',
  'snapchat',
  'soundcloud',
  'spotify',
  'telegram',
  'tumblr',
  'twitch',
  'twitter',
  'vimeo',
  'whatsapp',
  'yelp',
  'youtube',
] as const

const socialLinkTypesV1 = [...socialLinkTypesV0, 'x', 'slack'] as const

const socialLinkV0Schema = z.object({
  type: z.enum(socialLinkTypesV0),
  url: z.string(),
})

const socialLinkV1Schema = z.object({
  type: z.enum(socialLinkTypesV1),
  url: z.string(),
})

const socialLinksLinkV0Schema = z.object({
  id: z.string(),
  payload: socialLinkV0Schema,
})

const socialLinksLinkV1Schema = z.object({
  id: z.string(),
  payload: socialLinkV1Schema,
})

const socialLinksDataV0Schema = z.object({
  links: z.array(socialLinksLinkV0Schema),
  openInNewTab: z.boolean(),
})

const socialLinksDataV1Schema = z.object({
  links: z.array(socialLinksLinkV1Schema),
  openInNewTab: z.boolean(),
})

export const socialLinksDataSchema = z.union([
  socialLinksDataV0Schema,
  socialLinksDataV1Schema,
])

export type SocialLinksData = z.infer<typeof socialLinksDataSchema>

const socialLinksPropControllerDataV1Schema = socialLinksDataSchema

export type SocialLinksPropControllerDataV1 = z.infer<
  typeof socialLinksPropControllerDataV1Schema
>

export const SocialLinksPropControllerDataV2Type =
  'prop-controllers::social-links::v2'

const socialLinksPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(SocialLinksPropControllerDataV2Type),
  value: socialLinksDataSchema,
})

export type SocialLinksPropControllerDataV2 = z.infer<
  typeof socialLinksPropControllerDataV2Schema
>

export const socialLinksPropControllerDataSchema = z.union([
  socialLinksPropControllerDataV1Schema,
  socialLinksPropControllerDataV2Schema,
])

export type SocialLinksPropControllerData = z.infer<
  typeof socialLinksPropControllerDataSchema
>

export type SocialLinksOptions = Options<{
  preset?: SocialLinksPropControllerData
}>

type SocialLinksDescriptorV1<_T = SocialLinksPropControllerDataV1> = {
  type: typeof Types.SocialLinks
  version?: 1
  options: SocialLinksOptions
}

type SocialLinksDescriptorV2<_T = SocialLinksPropControllerData> = {
  type: typeof Types.SocialLinks
  version: 2
  options: SocialLinksOptions
}

export type SocialLinksDescriptor<_T = SocialLinksPropControllerData> =
  | SocialLinksDescriptorV1
  | SocialLinksDescriptorV2

export type ResolveSocialLinksPropControllerValue<
  T extends SocialLinksDescriptor,
> = T extends SocialLinksDescriptor ? SocialLinksData | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function SocialLinks(
  options: SocialLinksOptions = {},
): SocialLinksDescriptorV2 {
  return { type: Types.SocialLinks, version: 2, options }
}

export function getSocialLinkTypes(descriptor: SocialLinksDescriptor) {
  return match(descriptor)
    .with({ version: P.union(1, 2) }, () => socialLinkTypesV1)
    .otherwise(() => socialLinkTypesV0)
}

export function getSocialLinksPropControllerDataSocialLinksData(
  data: SocialLinksPropControllerData | undefined,
): SocialLinksData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: SocialLinksPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .otherwise((v0) => v0)
}

export function createSocialLinksPropControllerDataFromSocialLinksData(
  data: SocialLinksData,
  definition: SocialLinksDescriptor,
): SocialLinksPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: SocialLinksPropControllerDataV2Type,
          value: data,
        } as const),
    )
    .otherwise(() => data)
}

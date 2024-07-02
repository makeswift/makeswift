import {
  IconRadioGroupControlDefinition,
  ComboboxControlDefinition,
  ImageControlDefinition,
  LinkControlDefinition,
  type ResolvedValueType,
  ControlDefinition as UnifiedControlDefinition,
} from '@makeswift/controls'

import { type ResponsiveColor } from '../components/utils/types'
import { StyleControlFormattedValue } from '../runtimes/react/controls/style'
import type { Data } from '../state/react-page'
import { StyleControlType } from '../controls/style'
import {
  StyleControlDefinition,
  RichTextV2ControlDefinition,
  StyleV2ControlDefinition,
  TypographyControlDefinition,
} from '../controls'
import { ResolveImageControlValue } from '../runtimes/react/controls/image'
import { ComboboxControlValue } from '../runtimes/react/controls/combobox'
import { LinkControlValue } from '../runtimes/react/controls/link'
import { RichTextControlDefinition } from '../controls/rich-text'
import { RichTextControlValue } from '../runtimes/react/controls/rich-text/rich-text'
import { RichTextV2ControlValue } from '../runtimes/react/controls/rich-text-v2'
import { StyleV2ControlFormattedValue } from '../runtimes/react/controls/style-v2'
import { IconRadioGroupControlValue } from '../runtimes/react/controls/icon-radio-group'
import { TypographyControlValue } from '../runtimes/react/controls/typography'
import {
  BorderDescriptor,
  CheckboxDescriptor,
  LinkDescriptor,
  ResolveLinkPropControllerValue,
  Types as PropControllerTypes,
  ShadowsDescriptor,
  ResolveShadowsPropControllerValue,
  ResponsiveLengthDescriptor,
  ResolveResponsiveLengthPropControllerValue,
  NumberDescriptor,
  ResolveNumberPropControllerValue,
  ResponsiveColorDescriptor,
  ResolveCheckboxPropControllerValue,
  BorderRadiusDescriptor,
  ResolveBorderPropControllerValue,
  ResolveBorderRadiusPropControllerValue,
  DateDescriptor,
  ResolveDatePropControllerValue,
  FontDescriptor,
  ResolveFontPropControllerValue,
  VideoDescriptor,
  ResolveVideoPropControllerValue,
  TableDescriptor,
  ResolveTablePropControllerValue,
  MarginDescriptor,
  ResolveMarginPropControllerValue,
  PaddingDescriptor,
  ResolvePaddingPropControllerValue,
  WidthDescriptor,
  ResolveWidthPropControllerValue,
  TextStyleDescriptor,
  ResolveTextStylePropControllerValue,
  NavigationLinksDescriptor,
  ResolveNavigationLinksPropControllerValue,
  TextAreaDescriptor,
  ResolveTextAreaPropControllerValue,
  GapX,
  ResponsiveNumber,
  ResponsiveSelect,
  ResolveGapYPropControllerValue,
  GapYDescriptor,
  ElementIDDescriptor,
  ResolveElementIDPropControllerValue,
  TableFormFieldsDescriptor,
  ResolveTableFormFieldsPropControllerValue,
  GridDescriptor,
  ResolveGridPropControllerValue,
  ImageDescriptor,
  ResolveImagePropControllerValue,
  ImagesDescriptor,
  ResolveImagesPropControllerValue,
  BackgroundsDescriptor,
  ResolveBackgroundsPropControllerValue,
  ResponsiveOpacity,
  ResponsiveIconRadioGroup,
  ResolveSocialLinksPropControllerValue,
  SocialLinksDescriptor,
  TextInputDescriptor,
  ResolveTextInputPropControllerValue,
  type Descriptor as PropDescriptor,
  type Value as PropValue,
} from '@makeswift/prop-controllers'
import { DeletedPropControllerDescriptor } from './deleted'

export type { Data }

export type Gap = { value: number; unit: 'px' }

export const Types = {
  Style: StyleControlType,
} as const

type PropControllerDescriptor<T extends Data = Data> =
  | DeletedPropControllerDescriptor<T>
  | BackgroundsDescriptor<T>
  | BorderDescriptor<T>
  | BorderRadiusDescriptor<T>
  | CheckboxDescriptor<T>
  | DateDescriptor<T>
  | ElementIDDescriptor<T>
  | FontDescriptor<T>
  | PropDescriptor<typeof GapX>
  | GapYDescriptor<T>
  | GridDescriptor<T>
  | ImageDescriptor<T>
  | ImagesDescriptor<T>
  | LinkDescriptor<T>
  | MarginDescriptor<T>
  | NavigationLinksDescriptor<T>
  | NumberDescriptor<T>
  | PaddingDescriptor<T>
  | ResponsiveColorDescriptor<T>
  | ResponsiveLengthDescriptor<T>
  | PropDescriptor<typeof ResponsiveIconRadioGroup>
  | PropDescriptor<typeof ResponsiveNumber>
  | PropDescriptor<typeof ResponsiveOpacity>
  | PropDescriptor<typeof ResponsiveSelect>
  | ShadowsDescriptor<T>
  | SocialLinksDescriptor<T>
  | TableDescriptor<T>
  | TableFormFieldsDescriptor<T>
  | TextAreaDescriptor<T>
  | TextInputDescriptor<T>
  | TextStyleDescriptor<T>
  | VideoDescriptor<T>
  | WidthDescriptor<T>

export type LegacyDescriptor<T extends Data = Data> =
  | PropControllerDescriptor<T>
  | StyleControlDefinition
  | StyleV2ControlDefinition
  | TypographyControlDefinition
  | IconRadioGroupControlDefinition
  | ImageControlDefinition
  | ComboboxControlDefinition
  | LinkControlDefinition
  | RichTextControlDefinition
  | RichTextV2ControlDefinition

export type Descriptor<T extends Data = Data> = LegacyDescriptor<T> | UnifiedControlDefinition

export function isLegacyDescriptor<T extends Data>(
  control: Descriptor<T>,
): control is LegacyDescriptor<T> {
  return !(control instanceof UnifiedControlDefinition)
}

export type PanelDescriptorType =
  | typeof PropControllerTypes.Backgrounds
  | typeof PropControllerTypes.ResponsiveIconRadioGroup
  | typeof PropControllerTypes.Margin
  | typeof PropControllerTypes.Padding
  | typeof PropControllerTypes.Shadows
  | typeof PropControllerTypes.Border
  | typeof PropControllerTypes.GapY
  | typeof PropControllerTypes.GapX
  | typeof PropControllerTypes.BorderRadius
  | typeof PropControllerTypes.Checkbox
  | typeof PropControllerTypes.TextInput
  | typeof PropControllerTypes.Link
  | typeof PropControllerTypes.ResponsiveSelect
  | typeof PropControllerTypes.ResponsiveColor
  | typeof PropControllerTypes.TextStyle
  | typeof PropControllerTypes.Images
  | typeof PropControllerTypes.ResponsiveNumber
  | typeof PropControllerTypes.Number
  | typeof PropControllerTypes.Date
  | typeof PropControllerTypes.Font
  | typeof PropControllerTypes.TextArea
  | typeof PropControllerTypes.Table
  | typeof PropControllerTypes.Image
  | typeof PropControllerTypes.ResponsiveOpacity
  | typeof PropControllerTypes.SocialLinks
  | typeof PropControllerTypes.Video
  | typeof PropControllerTypes.NavigationLinks

export type PanelDescriptor<T extends Data = Data> = Extract<
  Descriptor<T>,
  { type: PanelDescriptorType }
>

export type PropControllerDescriptorValueType<T extends PropControllerDescriptor> =
  T['type'] extends typeof PropControllerTypes.ResponsiveColor
    ? // TODO(miguel): We're not importing a resolver type from `@makeswift/prop-controllers` because
      // the resolved type is tightly coupled with the runtime (i.e., it's the result of an API call).
      // This means that we probably want to rethink how types are resolved and where that lives.
      ResponsiveColor | null | undefined
    : T['type'] extends typeof PropControllerTypes.Backgrounds
      ? ResolveBackgroundsPropControllerValue<
          Extract<T, { type: typeof PropControllerTypes.Backgrounds }>
        >
      : T['type'] extends typeof PropControllerTypes.Checkbox
        ? ResolveCheckboxPropControllerValue<
            Extract<T, { type: typeof PropControllerTypes.Checkbox }>
          >
        : T['type'] extends typeof PropControllerTypes.Date
          ? ResolveDatePropControllerValue<Extract<T, { type: typeof PropControllerTypes.Date }>>
          : T['type'] extends typeof PropControllerTypes.ElementID
            ? ResolveElementIDPropControllerValue<
                Extract<T, { type: typeof PropControllerTypes.ElementID }>
              >
            : T['type'] extends typeof PropControllerTypes.Font
              ? ResolveFontPropControllerValue<
                  Extract<T, { type: typeof PropControllerTypes.Font }>
                >
              : T['type'] extends typeof PropControllerTypes.GapX
                ? PropValue<T> | undefined
                : T['type'] extends typeof PropControllerTypes.GapY
                  ? ResolveGapYPropControllerValue<
                      Extract<T, { type: typeof PropControllerTypes.GapY }>
                    >
                  : T['type'] extends typeof PropControllerTypes.Grid
                    ? ResolveGridPropControllerValue<
                        Extract<
                          T,
                          {
                            type: typeof PropControllerTypes.Grid
                          }
                        >
                      >
                    : T['type'] extends typeof PropControllerTypes.Image
                      ? ResolveImagePropControllerValue<
                          Extract<
                            T,
                            {
                              type: typeof PropControllerTypes.Image
                            }
                          >
                        >
                      : T['type'] extends typeof PropControllerTypes.Images
                        ? ResolveImagesPropControllerValue<
                            Extract<
                              T,
                              {
                                type: typeof PropControllerTypes.Images
                              }
                            >
                          >
                        : T['type'] extends typeof PropControllerTypes.ResponsiveIconRadioGroup
                          ? PropValue<T> | undefined
                          : T['type'] extends typeof PropControllerTypes.ResponsiveNumber
                            ? PropValue<T> | undefined
                            : T['type'] extends typeof PropControllerTypes.ResponsiveOpacity
                              ? PropValue<T> | undefined
                              : T['type'] extends typeof PropControllerTypes.ResponsiveSelect
                                ? PropValue<T> | undefined
                                : T['type'] extends typeof PropControllerTypes.Link
                                  ? ResolveLinkPropControllerValue<
                                      Extract<
                                        T,
                                        {
                                          type: typeof PropControllerTypes.Link
                                        }
                                      >
                                    >
                                  : T['type'] extends typeof PropControllerTypes.Width
                                    ? ResolveWidthPropControllerValue<
                                        Extract<
                                          T,
                                          {
                                            type: typeof PropControllerTypes.Width
                                          }
                                        >
                                      >
                                    : T['type'] extends typeof PropControllerTypes.Padding
                                      ? ResolvePaddingPropControllerValue<
                                          Extract<
                                            T,
                                            {
                                              type: typeof PropControllerTypes.Padding
                                            }
                                          >
                                        >
                                      : T['type'] extends typeof PropControllerTypes.Margin
                                        ? ResolveMarginPropControllerValue<
                                            Extract<
                                              T,
                                              {
                                                type: typeof PropControllerTypes.Margin
                                              }
                                            >
                                          >
                                        : T['type'] extends typeof PropControllerTypes.NavigationLinks
                                          ? ResolveNavigationLinksPropControllerValue<
                                              Extract<
                                                T,
                                                {
                                                  type: typeof PropControllerTypes.NavigationLinks
                                                }
                                              >
                                            >
                                          : T['type'] extends typeof PropControllerTypes.BorderRadius
                                            ? ResolveBorderRadiusPropControllerValue<
                                                Extract<
                                                  T,
                                                  {
                                                    type: typeof PropControllerTypes.BorderRadius
                                                  }
                                                >
                                              >
                                            : T['type'] extends typeof PropControllerTypes.Shadows
                                              ? ResolveShadowsPropControllerValue<
                                                  Extract<
                                                    T,
                                                    {
                                                      type: typeof PropControllerTypes.Shadows
                                                    }
                                                  >
                                                >
                                              : T['type'] extends typeof PropControllerTypes.SocialLinks
                                                ? ResolveSocialLinksPropControllerValue<
                                                    Extract<
                                                      T,
                                                      {
                                                        type: typeof PropControllerTypes.SocialLinks
                                                      }
                                                    >
                                                  >
                                                : T['type'] extends typeof PropControllerTypes.ResponsiveLength
                                                  ? ResolveResponsiveLengthPropControllerValue<
                                                      Extract<
                                                        T,
                                                        {
                                                          type: typeof PropControllerTypes.ResponsiveLength
                                                        }
                                                      >
                                                    >
                                                  : T['type'] extends typeof PropControllerTypes.Border
                                                    ? ResolveBorderPropControllerValue<
                                                        Extract<
                                                          T,
                                                          {
                                                            type: typeof PropControllerTypes.Border
                                                          }
                                                        >
                                                      >
                                                    : T['type'] extends typeof PropControllerTypes.Number
                                                      ? ResolveNumberPropControllerValue<
                                                          Extract<
                                                            T,
                                                            {
                                                              type: typeof PropControllerTypes.Number
                                                            }
                                                          >
                                                        >
                                                      : T['type'] extends typeof PropControllerTypes.Table
                                                        ? ResolveTablePropControllerValue<
                                                            Extract<
                                                              T,
                                                              {
                                                                type: typeof PropControllerTypes.Table
                                                              }
                                                            >
                                                          >
                                                        : T['type'] extends typeof PropControllerTypes.TableFormFields
                                                          ? ResolveTableFormFieldsPropControllerValue<
                                                              Extract<
                                                                T,
                                                                {
                                                                  type: typeof PropControllerTypes.TableFormFields
                                                                }
                                                              >
                                                            >
                                                          : T['type'] extends typeof PropControllerTypes.TextStyle
                                                            ? ResolveTextStylePropControllerValue<
                                                                Extract<
                                                                  T,
                                                                  {
                                                                    type: typeof PropControllerTypes.TextStyle
                                                                  }
                                                                >
                                                              >
                                                            : T['type'] extends typeof PropControllerTypes.TextArea
                                                              ? ResolveTextAreaPropControllerValue<
                                                                  Extract<
                                                                    T,
                                                                    {
                                                                      type: typeof PropControllerTypes.TextArea
                                                                    }
                                                                  >
                                                                >
                                                              : T['type'] extends typeof PropControllerTypes.TextInput
                                                                ? ResolveTextInputPropControllerValue<
                                                                    Extract<
                                                                      T,
                                                                      {
                                                                        type: typeof PropControllerTypes.TextInput
                                                                      }
                                                                    >
                                                                  >
                                                                : T['type'] extends typeof PropControllerTypes.Video
                                                                  ? ResolveVideoPropControllerValue<
                                                                      Extract<
                                                                        T,
                                                                        {
                                                                          type: typeof PropControllerTypes.Video
                                                                        }
                                                                      >
                                                                    >
                                                                  : never

export type DescriptorValueType<T extends Descriptor> = T extends PropControllerDescriptor
  ? PropControllerDescriptorValueType<T>
  : T extends StyleControlDefinition
    ? StyleControlFormattedValue
    : T extends StyleV2ControlDefinition
      ? StyleV2ControlFormattedValue
      : T extends IconRadioGroupControlDefinition
        ? IconRadioGroupControlValue<T>
        : T extends ImageControlDefinition
          ? ResolveImageControlValue<T>
          : T extends ComboboxControlDefinition
            ? ComboboxControlValue<T>
            : T extends LinkControlDefinition
              ? LinkControlValue<T>
              : T extends RichTextControlDefinition
                ? RichTextControlValue
                : T extends RichTextV2ControlDefinition
                  ? RichTextV2ControlValue
                  : T extends StyleV2ControlDefinition
                    ? StyleV2ControlFormattedValue
                    : T extends TypographyControlDefinition
                      ? TypographyControlValue
                      : T extends UnifiedControlDefinition
                        ? ResolvedValueType<T>
                        : T extends Descriptor<infer U>
                          ? U | undefined
                          : never

export type PanelDescriptorValueType<T extends PanelDescriptor> =
  T extends PanelDescriptor<infer U> ? U : never

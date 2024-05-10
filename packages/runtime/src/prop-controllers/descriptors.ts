import {
  CheckboxControlDefinition,
  IconRadioGroupControlDefinition,
  NumberControlDefinition,
  TextInputControlDefinition,
  TextAreaControlDefinition,
} from '@makeswift/controls'
import { ResponsiveColor } from '../runtimes/react/controls'
import { StyleControlFormattedValue } from '../runtimes/react/controls/style'
import type { Data } from '../state/react-page'
import { NumberControlValue } from '../runtimes/react/controls/number'
import { StyleControlType } from '../controls/style'
import {
  ColorControlDefinition,
  ComboboxControlDefinition,
  ImageControlDefinition,
  LinkControlDefinition,
  ListControlDefinition,
  SelectControlDefinition,
  ShapeControlDefinition,
  SlotControlDefinition,
  StyleControlDefinition,
  RichTextV2ControlDefinition,
  StyleV2ControlDefinition,
  TypographyControlDefinition,
} from '../controls'
import { TextInputControlValue } from '../runtimes/react/controls/text-input'
import { TextAreaControlValue } from '../runtimes/react/controls/text-area'
import { ColorControlValue } from '../runtimes/react/controls/color'
import { SelectControlValue } from '../runtimes/react/controls/select'
import { CheckboxControlValue } from '../runtimes/react/controls/checkbox'
import { ResolveImageControlValue } from '../runtimes/react/controls/image'
import { ShapeControlValue } from '../runtimes/react/controls/shape'
import { ListControlValue } from '../runtimes/react/controls/list'
import { ComboboxControlValue } from '../runtimes/react/controls/combobox'
import { LinkControlValue } from '../runtimes/react/controls/link'
import { SlotControlValue } from '../runtimes/react/controls/slot'
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
  ResponsiveValueType,
  ShadowsDescriptor,
  ResolveShadowsPropControllerValue,
  ResponsiveValue,
  Options,
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
  type Descriptor as PropDescriptor,
  type Value as PropValue,
  ResponsiveOpacity,
  ResolveSocialLinksPropControllerValue,
  SocialLinksDescriptor,
  TextInputDescriptor,
  ResolveTextInputPropControllerValue,
} from '@makeswift/prop-controllers'
import { DeletedPropControllerDescriptor } from './deleted'

export type { Data }

type IconName =
  | 'HeightAuto16'
  | 'HeightMatch16'
  | 'VerticalAlignStart16'
  | 'VerticalAlignMiddle16'
  | 'VerticalAlignEnd16'
  | 'VerticalAlignSpaceBetween16'
  | 'ButtonPill16'
  | 'ButtonRounded16'
  | 'ButtonSquare16'
  | 'SizeSmall16'
  | 'SizeMedium16'
  | 'SizeLarge16'
  | 'ArrowInside16'
  | 'ArrowCenter16'
  | 'ArrowOutside16'
  | 'CountdownSolid16'
  | 'CountdownSolidSplit16'
  | 'CountdownOutline16'
  | 'CountdownOutlineSplit16'
  | 'CountdownNaked16'
  | 'Sun16'
  | 'Moon16'
  | 'AlignLeft16'
  | 'AlignCenter16'
  | 'AlignRight16'
  | 'Star16'
  | 'StarCircle16'
  | 'StarRoundedSquare16'
  | 'StarSquare16'

export type Gap = { value: number; unit: 'px' }

export const Types = {
  ResponsiveIconRadioGroup: 'ResponsiveIconRadioGroup',
  ResponsiveSelect: 'ResponsiveSelect',
  Style: StyleControlType,
} as const

export type IconRadioGroupOption<T extends string> = { value: T; label: string; icon: IconName }

export type ResponsiveIconRadioGroupValue<T extends string = string> = ResponsiveValue<T>

export type ResponsiveIconRadioGroupOptions<T extends string = string, U extends T = T> = Options<{
  label?: string
  options: IconRadioGroupOption<T>[]
  defaultValue?: U
  hidden?: boolean
}>

export type ResponsiveIconRadioGroupDescriptor<
  T extends ResponsiveIconRadioGroupValue<string> = ResponsiveIconRadioGroupValue<string>,
> = {
  type: typeof Types.ResponsiveIconRadioGroup
  options: ResponsiveIconRadioGroupOptions<ResponsiveValueType<T>>
}

// HACK(miguel): We have to use a layer of indirection with `_T` and `T` because otherwise the
// values provided would undergo type widening. For some reason, the extra layer of indirection
// reuslts in TypeScript not widening types. Note, this only happens when the returned value of this
// function is passed to another as an argument, which is common with the `registerComponent` API.
/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveIconRadioGroup<_T extends string, T extends _T, U extends T>(
  options: ResponsiveIconRadioGroupOptions<T, U>,
): ResponsiveIconRadioGroupDescriptor<ResponsiveIconRadioGroupValue<T>> {
  return { type: Types.ResponsiveIconRadioGroup, options }
}

export type ResponsiveSelectValue<T extends string = string> = ResponsiveValue<T>

export type SelectLabelOrientation = 'vertical' | 'horizontal'

export type SelectOption<T extends string> = { value: T; label: string }

export type ResponsiveSelectOptions<T extends string = string, U extends T = T> = Options<{
  label?: string
  labelOrientation?: SelectLabelOrientation
  options: SelectOption<T>[]
  defaultValue?: U
  hidden?: boolean
}>

export type ResponsiveSelectDescriptor<
  T extends ResponsiveSelectValue<string> = ResponsiveSelectValue<string>,
> = {
  type: typeof Types.ResponsiveSelect
  options: ResponsiveSelectOptions<ResponsiveValueType<T>>
}

// HACK(miguel): We have to use a layer of indirection with `_T` and `T` because otherwise the
// values provided would undergo type widening. For some reason, the extra layer of indirection
// reuslts in TypeScript not widening types. Note, this only happens when the returned value of this
// function is passed to another as an argument, which is common with the `registerComponent` API.
/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveSelect<_T extends string, T extends _T, U extends T>(
  options: ResponsiveSelectOptions<T, U>,
): ResponsiveSelectDescriptor<ResponsiveSelectValue<T>> {
  return { type: Types.ResponsiveSelect, options }
}

export type Descriptor<T extends Data = Data> =
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
  | ResponsiveIconRadioGroupDescriptor<
      T extends ResponsiveIconRadioGroupValue<string> ? T : ResponsiveIconRadioGroupValue<string>
    >
  | ResponsiveLengthDescriptor<T>
  | PropDescriptor<typeof ResponsiveNumber>
  | PropDescriptor<typeof ResponsiveOpacity>
  | ResponsiveSelectDescriptor<
      T extends ResponsiveSelectValue<string> ? T : ResponsiveSelectValue<string>
    >
  | ShadowsDescriptor<T>
  | SocialLinksDescriptor<T>
  | TableDescriptor<T>
  | TableFormFieldsDescriptor<T>
  | TextAreaDescriptor<T>
  | TextInputDescriptor<T>
  | TextStyleDescriptor<T>
  | VideoDescriptor<T>
  | WidthDescriptor<T>
  | StyleControlDefinition
  | StyleV2ControlDefinition
  | NumberControlDefinition
  | CheckboxControlDefinition
  | TextInputControlDefinition
  | TextAreaControlDefinition
  | SelectControlDefinition
  | ColorControlDefinition
  | IconRadioGroupControlDefinition
  | ImageControlDefinition
  | ComboboxControlDefinition
  | ShapeControlDefinition
  | ListControlDefinition
  | LinkControlDefinition
  | SlotControlDefinition
  | RichTextControlDefinition
  | RichTextV2ControlDefinition
  | TypographyControlDefinition

export type PanelDescriptorType =
  | typeof PropControllerTypes.Backgrounds
  | typeof Types.ResponsiveIconRadioGroup
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
  | typeof Types.ResponsiveSelect
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

export type DescriptorValueType<T extends Descriptor> = T extends NumberControlDefinition
  ? NumberControlValue<T>
  : T extends CheckboxControlDefinition
  ? CheckboxControlValue<T>
  : T extends TextInputControlDefinition
  ? TextInputControlValue<T>
  : T extends TextAreaControlDefinition
  ? TextAreaControlValue<T>
  : T extends SelectControlDefinition
  ? SelectControlValue<T>
  : T extends ColorControlDefinition
  ? ColorControlValue<T>
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
  : T extends ShapeControlDefinition
  ? ShapeControlValue<T>
  : T extends ListControlDefinition
  ? ListControlValue<T>
  : T extends LinkControlDefinition
  ? LinkControlValue<T>
  : T extends SlotControlDefinition
  ? SlotControlValue
  : T extends RichTextControlDefinition
  ? RichTextControlValue
  : T extends RichTextV2ControlDefinition
  ? RichTextV2ControlValue
  : T extends StyleV2ControlDefinition
  ? StyleV2ControlFormattedValue
  : T extends TypographyControlDefinition
  ? TypographyControlValue
  : T['type'] extends typeof PropControllerTypes.ResponsiveColor
  ? // TODO(miguel): We're not importing a resolver type from `@makeswift/prop-controllers` because
    // the resolved type is tightly coupled with the runtime (i.e., it's the result of an API call).
    // This means that we probably want to rethink how types are resolved and where that lives.
    ResponsiveColor | null | undefined
  : T['type'] extends typeof PropControllerTypes.Backgrounds
  ? ResolveBackgroundsPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.Backgrounds }>
    >
  : T['type'] extends typeof PropControllerTypes.Checkbox
  ? ResolveCheckboxPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Checkbox }>>
  : T['type'] extends typeof PropControllerTypes.Date
  ? ResolveDatePropControllerValue<Extract<T, { type: typeof PropControllerTypes.Date }>>
  : T['type'] extends typeof PropControllerTypes.ElementID
  ? ResolveElementIDPropControllerValue<Extract<T, { type: typeof PropControllerTypes.ElementID }>>
  : T['type'] extends typeof PropControllerTypes.Font
  ? ResolveFontPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Font }>>
  : T['type'] extends typeof PropControllerTypes.GapX
  ? PropValue<T> | undefined
  : T['type'] extends typeof PropControllerTypes.GapY
  ? ResolveGapYPropControllerValue<Extract<T, { type: typeof PropControllerTypes.GapY }>>
  : T['type'] extends typeof PropControllerTypes.Grid
  ? ResolveGridPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Grid }>>
  : T['type'] extends typeof PropControllerTypes.Image
  ? ResolveImagePropControllerValue<Extract<T, { type: typeof PropControllerTypes.Image }>>
  : T['type'] extends typeof PropControllerTypes.Images
  ? ResolveImagesPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Images }>>
  : T['type'] extends typeof PropControllerTypes.ResponsiveNumber
  ? PropValue<T> | undefined
  : T['type'] extends typeof PropControllerTypes.ResponsiveOpacity
  ? PropValue<T> | undefined
  : T['type'] extends typeof PropControllerTypes.Link
  ? ResolveLinkPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Link }>>
  : T['type'] extends typeof PropControllerTypes.Width
  ? ResolveWidthPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Width }>>
  : T['type'] extends typeof PropControllerTypes.Padding
  ? ResolvePaddingPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Padding }>>
  : T['type'] extends typeof PropControllerTypes.Margin
  ? ResolveMarginPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Margin }>>
  : T['type'] extends typeof PropControllerTypes.NavigationLinks
  ? ResolveNavigationLinksPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.NavigationLinks }>
    >
  : T['type'] extends typeof PropControllerTypes.BorderRadius
  ? ResolveBorderRadiusPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.BorderRadius }>
    >
  : T['type'] extends typeof PropControllerTypes.Shadows
  ? ResolveShadowsPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Shadows }>>
  : T['type'] extends typeof PropControllerTypes.SocialLinks
  ? ResolveSocialLinksPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.SocialLinks }>
    >
  : T['type'] extends typeof PropControllerTypes.ResponsiveLength
  ? ResolveResponsiveLengthPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.ResponsiveLength }>
    >
  : T['type'] extends typeof PropControllerTypes.Border
  ? ResolveBorderPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Border }>>
  : T['type'] extends typeof PropControllerTypes.Number
  ? ResolveNumberPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Number }>>
  : T['type'] extends typeof PropControllerTypes.Table
  ? ResolveTablePropControllerValue<Extract<T, { type: typeof PropControllerTypes.Table }>>
  : T['type'] extends typeof PropControllerTypes.TableFormFields
  ? ResolveTableFormFieldsPropControllerValue<
      Extract<T, { type: typeof PropControllerTypes.TableFormFields }>
    >
  : T['type'] extends typeof PropControllerTypes.TextStyle
  ? ResolveTextStylePropControllerValue<Extract<T, { type: typeof PropControllerTypes.TextStyle }>>
  : T['type'] extends typeof PropControllerTypes.TextArea
  ? ResolveTextAreaPropControllerValue<Extract<T, { type: typeof PropControllerTypes.TextArea }>>
  : T['type'] extends typeof PropControllerTypes.TextInput
  ? ResolveTextInputPropControllerValue<Extract<T, { type: typeof PropControllerTypes.TextInput }>>
  : T['type'] extends typeof PropControllerTypes.Video
  ? ResolveVideoPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Video }>>
  : T extends Descriptor<infer U>
  ? U | undefined
  : never

export type PanelDescriptorValueType<T extends PanelDescriptor> = T extends PanelDescriptor<infer U>
  ? U
  : never

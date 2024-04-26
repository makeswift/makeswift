import { ResponsiveColor } from '../runtimes/react/controls'
import { StyleControlFormattedValue } from '../runtimes/react/controls/style'
import type { Element, Data, MergeTranslatableDataContext } from '../state/react-page'
import { NumberControlDefinition } from '../controls/number'
import { NumberControlValue } from '../runtimes/react/controls/number'
import { StyleControlType } from '../controls/style'
import {
  CheckboxControlDefinition,
  ColorControlDefinition,
  ComboboxControlDefinition,
  ImageControlDefinition,
  LinkControlDefinition,
  ListControlDefinition,
  SelectControlDefinition,
  ShapeControlDefinition,
  SlotControlDefinition,
  TextAreaControlDefinition,
  TextInputControlDefinition,
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
import { RichTextControlDefinition, RichTextDTO } from '../controls/rich-text'
import { RichTextControlValue } from '../runtimes/react/controls/rich-text/rich-text'
import { RichTextV2ControlValue } from '../runtimes/react/controls/rich-text-v2'
import { StyleV2ControlFormattedValue } from '../runtimes/react/controls/style-v2'
import { IconRadioGroupControlDefinition } from '../controls/icon-radio-group'
import { IconRadioGroupControlValue } from '../runtimes/react/controls/icon-radio-group'
import { TypographyControlValue } from '../runtimes/react/controls/typography'
import {
  BorderDescriptor,
  CheckboxDescriptor,
  LinkData,
  LinkDescriptor,
  ResolveLinkPropControllerValue,
  Types as PropControllerTypes,
  ColorData as Color,
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
} from '@makeswift/prop-controllers'

export type { Data }

// See https://github.com/microsoft/TypeScript/issues/15300
export type IndexSignatureHack<T> = T extends Record<string, any>
  ? { [K in keyof T]: IndexSignatureHack<T[K]> }
  : T

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
  Backgrounds: 'Backgrounds',
  ElementID: 'ElementID',
  GapX: 'GapX',
  GapY: 'GapY',
  Grid: 'Grid',
  Image: 'Image',
  Images: 'Images',
  ResponsiveIconRadioGroup: 'ResponsiveIconRadioGroup',
  ResponsiveNumber: 'ResponsiveNumber',
  ResponsiveOpacity: 'ResponsiveOpacity',
  ResponsiveSelect: 'ResponsiveSelect',
  RichText: 'RichText',
  SocialLinks: 'SocialLinks',
  TableFormFields: 'TableFormFields',
  TextInput: 'TextInput',
  Style: StyleControlType,
} as const

type ColorBackground = { type: 'color'; id: string; payload: Color | null }

type GradientStop = { id: string; location: number; color: Color | null }

type Gradient = { angle?: number; isRadial?: boolean; stops: GradientStop[] }

type GradientBackground = { type: 'gradient'; id: string; payload: Gradient }

type BackgroundImagePosition = { x: number; y: number }

type BackgroundImageSize = 'cover' | 'contain' | 'auto'

type BackgroundImageRepeat = 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat'

type BackgroundImageV0 = {
  imageId: ImageValueV0
  position: BackgroundImagePosition
  size?: BackgroundImageSize
  repeat?: BackgroundImageRepeat
  opacity?: number
  parallax?: number
  priority?: boolean
}

type BackgroundImageV1 = {
  version: 1
  image: ImageValueV1
  position: BackgroundImagePosition
  size?: BackgroundImageSize
  repeat?: BackgroundImageRepeat
  opacity?: number
  parallax?: number
  priority?: boolean
}

export type BackgroundImage = BackgroundImageV0 | BackgroundImageV1

type ImageBackgroundV0 = { type: 'image'; id: string; payload: BackgroundImageV0 }

type ImageBackgroundV1 = { type: 'image-v1'; id: string; payload: BackgroundImageV1 }

export type ImageBackground = ImageBackgroundV0 | ImageBackgroundV1

type BackgroundVideoAspectRatio = 'wide' | 'standard'

type BackgroundVideo = {
  url?: string
  maskColor?: Color | null
  opacity?: number
  zoom?: number
  aspectRatio?: BackgroundVideoAspectRatio
  parallax?: number
}

type VideoBackground = { type: 'video'; id: string; payload: BackgroundVideo }

type Background = ColorBackground | GradientBackground | ImageBackground | VideoBackground

export type BackgroundsValue = ResponsiveValue<Background[]>

type BackgroundsOptions = Options<Record<string, never>>

export type BackgroundsDescriptor<_T = BackgroundsValue> = {
  type: typeof Types.Backgrounds
  version?: 1
  options: BackgroundsOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Backgrounds(options: BackgroundsOptions = {}): BackgroundsDescriptor {
  return { type: Types.Backgrounds, version: 1, options }
}

export type ElementIDValue = string

type ElementIDOptions = Options<Record<string, never>>

type ElementIDDescriptor<_T = ElementIDValue> = {
  type: typeof Types.ElementID
  options: ElementIDOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ElementID(options: ElementIDOptions = {}): ElementIDDescriptor {
  return { type: Types.ElementID, options }
}

export type GapXValue = ResponsiveValue<Gap>

export type GapXOptions = Options<{
  preset?: GapXValue
  label?: string
  defaultValue?: Gap
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}>

export type GapXDescriptor<_T = GapXValue> = { type: typeof Types.GapX; options: GapXOptions }

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function GapX(options: GapXOptions = {}): GapXDescriptor {
  return { type: Types.GapX, options }
}

export type GapYValue = ResponsiveValue<Gap>

export type GapYOptions = Options<{
  preset?: GapYValue
  label?: string
  defaultValue?: Gap
  step?: number
  min?: number
  max?: number
  hidden?: boolean
}>

export type GapYDescriptor<_T = GapYValue> = { type: typeof Types.GapY; options: GapYOptions }

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function GapY(options: GapYOptions = {}): GapYDescriptor {
  return { type: Types.GapY, options }
}

type GridColumn = { count: number; spans: number[][] }

export type GridValue = { elements: Element[]; columns: ResponsiveValue<GridColumn> }

type GridOptions = Options<Record<string, never>>

type GridDescriptor<_T = GridValue> = { type: typeof Types.Grid; options: GridOptions }

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Grid(options: GridOptions = {}): GridDescriptor {
  return { type: Types.Grid, options }
}

export function mergeGridPropControllerTranslatedData(
  data: GridValue,
  context: MergeTranslatableDataContext,
) {
  return {
    ...data,
    elements: data.elements.map(element => context.mergeTranslatedData(element)),
  }
}

export type ImageValueV0 = string

type ImageValueV1MakeswiftFile = {
  version: 1
  type: 'makeswift-file'
  id: string
}

type ImageValueV1ExternalFile = {
  version: 1
  type: 'external-file'
  url: string
  width?: number | null
  height?: number | null
}

export type ImageValueV1 = ImageValueV1MakeswiftFile | ImageValueV1ExternalFile

export type ImageValue = ImageValueV0 | ImageValueV1

export type ImageOptions = Options<{ label?: string; hidden?: boolean }>

export type ImageDescriptor<_T = ImageValue> = {
  type: typeof Types.Image
  version?: 1
  options: ImageOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Image(options: ImageOptions = {}): ImageDescriptor {
  return { type: Types.Image, version: 1, options }
}

export type ImagesValueV0Item = {
  key: string
  props: {
    link?: LinkData
    file?: ImageValueV0
    altText?: string
  }
}

export type ImagesValueV1Item = {
  key: string
  version: 1
  props: {
    link?: LinkData
    file?: ImageValueV1
    altText?: string
  }
}

export type ImagesValueItem = ImagesValueV0Item | ImagesValueV1Item

export type ImagesValue = ImagesValueItem[]

type ImagesOptions = Options<{ preset?: ImagesValue }>

export type ImagesDescriptor<_T = ImagesValue> = {
  type: typeof Types.Images
  version?: 1
  options: ImagesOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Images(options: ImagesOptions = {}): ImagesDescriptor {
  return { type: Types.Images, version: 1, options }
}

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

export type ResponsiveNumberValue = ResponsiveValue<number>

export type ResponsiveNumberOptions = Options<{
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}>

export type ResponsiveNumberDescriptor<_T = ResponsiveNumberValue> = {
  type: typeof Types.ResponsiveNumber
  options: ResponsiveNumberOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveNumber(
  options: ResponsiveNumberOptions = {},
): ResponsiveNumberDescriptor {
  return { type: Types.ResponsiveNumber, options }
}

export type ResponsiveOpacityValue = ResponsiveValue<number>

type ResponsiveOpacityOptions = Options<Record<string, never>>

type ResponsiveOpacityDescriptor<_T = ResponsiveOpacityValue> = {
  type: typeof Types.ResponsiveOpacity
  options: ResponsiveOpacityOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveOpacity(
  options: ResponsiveOpacityOptions = {},
): ResponsiveOpacityDescriptor {
  return { type: Types.ResponsiveOpacity, options }
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

export type RichTextValue = IndexSignatureHack<RichTextDTO>

export type RichTextOptions = Options<{ preset?: RichTextValue }>

export type RichTextDescriptor<_T extends Data = RichTextValue> = {
  type: typeof Types.RichText
  options: RichTextOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function RichText(options: RichTextOptions = {}): RichTextDescriptor {
  return { type: Types.RichText, options }
}

export const socialLinkTypesV0 = [
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

type SocialLinkTypeV0 = typeof socialLinkTypesV0[number]

export const socialLinkTypesV1 = [...socialLinkTypesV0, 'x', 'slack'] as const

type SocialLinkTypeV1 = typeof socialLinkTypesV1[number]

type SocialLinkV0 = { type: SocialLinkTypeV0; url: string }

type SocialLinkV1 = { type: SocialLinkTypeV1; url: string }

type SocialLinksLinkV0 = { id: string; payload: SocialLinkV0 }

type SocialLinksLinkV1 = { id: string; payload: SocialLinkV1 }

type SocialLinksValueV0 = { links: SocialLinksLinkV0[]; openInNewTab: boolean }

type SocialLinksValueV1 = { links: SocialLinksLinkV1[]; openInNewTab: boolean }

export type SocialLinksValue = SocialLinksValueV0 | SocialLinksValueV1

type SocialLinksOptions = Options<{ preset?: SocialLinksValueV1 }>

export type SocialLinksDescriptor<_T = SocialLinksValueV1> = {
  type: typeof Types.SocialLinks
  options: SocialLinksOptions
  version?: 1
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function SocialLinks(options: SocialLinksOptions = {}): SocialLinksDescriptor {
  return { type: Types.SocialLinks, options, version: 1 }
}

type TableFormField = {
  id: string
  tableColumnId: string
  label?: string
  placeholder?: string
  defaultValue?: string | boolean | string[]
  required?: boolean
  hidden?: boolean
  type?: 'select' | 'radio'
  hideLabel?: boolean
  autofill?: boolean
}

type Grid = { count: number; spans: number[][] }

export type TableFormFieldsValue = { fields: TableFormField[]; grid: ResponsiveValue<Grid> }

type TableFormFieldsOptions = Options<{ preset?: TableFormFieldsValue }>

export type TableFormFieldsDescriptor<_T = TableFormFieldsValue> = {
  type: typeof Types.TableFormFields
  options: TableFormFieldsOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function TableFormFields(options: TableFormFieldsOptions = {}): TableFormFieldsDescriptor {
  return { type: Types.TableFormFields, options }
}

export type TextInputValue = string

export type TextInputOptions = Options<{ label?: string; placeholder?: string; hidden?: boolean }>

export type TextInputDescriptor<_T = TextInputValue> = {
  type: typeof Types.TextInput
  options: TextInputOptions
}

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function TextInput(options: TextInputOptions = {}): TextInputDescriptor {
  return { type: Types.TextInput, options }
}

export type Descriptor<T extends Data = Data> =
  | BackgroundsDescriptor<T>
  | BorderDescriptor<T>
  | BorderRadiusDescriptor<T>
  | CheckboxDescriptor<T>
  | DateDescriptor<T>
  | ElementIDDescriptor<T>
  | FontDescriptor<T>
  | GapXDescriptor<T>
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
  | ResponsiveNumberDescriptor<T>
  | ResponsiveOpacityDescriptor<T>
  | ResponsiveSelectDescriptor<
      T extends ResponsiveSelectValue<string> ? T : ResponsiveSelectValue<string>
    >
  | RichTextDescriptor<T>
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
  | typeof Types.Backgrounds
  | typeof Types.ResponsiveIconRadioGroup
  | typeof PropControllerTypes.Margin
  | typeof PropControllerTypes.Padding
  | typeof PropControllerTypes.Shadows
  | typeof PropControllerTypes.Border
  | typeof Types.GapY
  | typeof Types.GapX
  | typeof PropControllerTypes.BorderRadius
  | typeof PropControllerTypes.Checkbox
  | typeof Types.TextInput
  | typeof PropControllerTypes.Link
  | typeof Types.ResponsiveSelect
  | typeof PropControllerTypes.ResponsiveColor
  | typeof PropControllerTypes.TextStyle
  | typeof Types.Images
  | typeof Types.ResponsiveNumber
  | typeof PropControllerTypes.Number
  | typeof PropControllerTypes.Date
  | typeof PropControllerTypes.Font
  | typeof PropControllerTypes.TextArea
  | typeof PropControllerTypes.Table
  | typeof Types.RichText
  | typeof Types.Image
  | typeof Types.ResponsiveOpacity
  | typeof Types.SocialLinks
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
  : T['type'] extends typeof PropControllerTypes.Checkbox
  ? ResolveCheckboxPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Checkbox }>>
  : T['type'] extends typeof PropControllerTypes.Date
  ? ResolveDatePropControllerValue<Extract<T, { type: typeof PropControllerTypes.Date }>>
  : T['type'] extends typeof PropControllerTypes.Font
  ? ResolveFontPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Font }>>
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
  : T['type'] extends typeof PropControllerTypes.TextStyle
  ? ResolveTextStylePropControllerValue<Extract<T, { type: typeof PropControllerTypes.TextStyle }>>
  : T['type'] extends typeof PropControllerTypes.TextArea
  ? ResolveTextAreaPropControllerValue<Extract<T, { type: typeof PropControllerTypes.TextArea }>>
  : T['type'] extends typeof PropControllerTypes.Video
  ? ResolveVideoPropControllerValue<Extract<T, { type: typeof PropControllerTypes.Video }>>
  : T extends Descriptor<infer U>
  ? U | undefined
  : never

export type PanelDescriptorValueType<T extends PanelDescriptor> = T extends PanelDescriptor<infer U>
  ? U
  : never

import {
  ResolveBorderControlValue,
  ResolveBorderRadiusControlValue,
  ResolveMarginControlValue,
  ResolvePaddingControlValue,
  ResolveShadowsControlValue,
  ResolveWidthControlValue,
} from '../runtimes/react/controls'
import { StyleControlFormattedValue } from '../runtimes/react/controls/style'
import type { Element, Data, MergeTranslatableDataContext } from '../state/react-page'
import type { ResponsiveColor } from '../runtimes/react/controls'
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
  getElementChildren,
  getFileIds,
  getPageIds,
  getSwatchIds,
  getTypographyIds,
} from './introspection'

export type { Data }

// See https://github.com/microsoft/TypeScript/issues/15300
export type IndexSignatureHack<T> = T extends Record<string, any>
  ? { [K in keyof T]: IndexSignatureHack<T[K]> }
  : T

export type Device = string

export type DeviceOverride<T> = { deviceId: Device; value: T }

export type ResponsiveValue<T> = DeviceOverride<T>[]

export type ResponsiveValueType<T> = T extends ResponsiveValue<infer U> ? U : never

type Color = { swatchId: string; alpha: number }

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

export type Length = { value: number; unit: 'px' | '%' }

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

type Link = OpenPageLink | OpenURLLink | SendEmailLink | CallPhoneLink | ScrollToElementLink

type TextStyle = {
  fontFamily?: string | null | undefined
  letterSpacing: number | null | undefined
  fontSize: { value: number; unit: 'px' } | null | undefined
  fontWeight: number | null | undefined
  textTransform: 'uppercase'[]
  fontStyle: 'italic'[]
}

export const Types = {
  Backgrounds: 'Backgrounds',
  Border: 'Border',
  BorderRadius: 'BorderRadius',
  Checkbox: 'Checkbox',
  Date: 'Date',
  ElementID: 'ElementID',
  Font: 'Font',
  GapX: 'GapX',
  GapY: 'GapY',
  Grid: 'Grid',
  Image: 'Image',
  Images: 'Images',
  Link: 'Link',
  List: 'List',
  Margin: 'Margin',
  NavigationLinks: 'NavigationLinks',
  Number: 'Number',
  Padding: 'Padding',
  ResponsiveColor: 'ResponsiveColor',
  ResponsiveIconRadioGroup: 'ResponsiveIconRadioGroup',
  ResponsiveLength: 'ResponsiveLength',
  ResponsiveNumber: 'ResponsiveNumber',
  ResponsiveOpacity: 'ResponsiveOpacity',
  ResponsiveSelect: 'ResponsiveSelect',
  RichText: 'RichText',
  Shadows: 'Shadows',
  Shape: 'Shape',
  SocialLinks: 'SocialLinks',
  Table: 'Table',
  TableFormFields: 'TableFormFields',
  Typeahead: 'Typeahead',
  TextArea: 'TextArea',
  TextInput: 'TextInput',
  TextStyle: 'TextStyle',
  Video: 'Video',
  Width: 'Width',
  Style: StyleControlType,
} as const

type Options<T> = T | ((props: Record<string, unknown>, deviceMode: Device) => T)

export type ResolveOptions<T extends Options<unknown>> = T extends Options<infer U> ? U : never

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

export function Backgrounds(options: BackgroundsOptions = {}): BackgroundsDescriptor {
  return { type: Types.Backgrounds, version: 1, options }
}

type BorderSideStyle = 'dashed' | 'dotted' | 'solid'

export type BorderSide = {
  width: number | null | undefined
  style: BorderSideStyle
  color?: Color | null
}

type Border = {
  [K in 'top' | 'right' | 'bottom' | 'left' as `border${Capitalize<K>}`]:
    | BorderSide
    | null
    | undefined
}

export type BorderValue = ResponsiveValue<Border>

export const BorderPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::border::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers:border::format::responsive-value',
} as const

export type BorderPropControllerFormat =
  typeof BorderPropControllerFormat[keyof typeof BorderPropControllerFormat]

type BorderOptions = { format?: BorderPropControllerFormat }

export type BorderDescriptor<_T = BorderValue, U extends BorderOptions = BorderOptions> = {
  type: typeof Types.Border
  options: U
}

export function Border<T extends BorderOptions>(
  options: T & BorderOptions = {} as T,
): BorderDescriptor<BorderValue, T> {
  return { type: Types.Border, options }
}

Border.Format = BorderPropControllerFormat

type BorderRadius = {
  [K in 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' as `border${Capitalize<K>}Radius`]:
    | Length
    | null
    | undefined
}

export type BorderRadiusValue = ResponsiveValue<BorderRadius>

export const BorderRadiusPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::border-radius::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers::border-radius::format::responsive-value',
} as const

export type BorderRadiusPropControllerFormat =
  typeof BorderRadiusPropControllerFormat[keyof typeof BorderRadiusPropControllerFormat]

type BorderRadiusOptions = { format?: BorderRadiusPropControllerFormat }

export type BorderRadiusDescriptor<
  _T = BorderRadiusValue,
  U extends BorderRadiusOptions = BorderRadiusOptions,
> = {
  type: typeof Types.BorderRadius
  options: U
}

export function BorderRadius<T extends BorderRadiusOptions>(
  options: T & BorderRadiusOptions = {} as T,
): BorderRadiusDescriptor<BorderRadiusValue, T> {
  return { type: Types.BorderRadius, options }
}

BorderRadius.Format = BorderRadiusPropControllerFormat

export type CheckboxValue = boolean

export type CheckboxOptions = Options<{
  preset?: CheckboxValue
  label: string
  hidden?: boolean
}>

export type CheckboxDescriptor<_T = CheckboxValue> = {
  type: typeof Types.Checkbox
  options: CheckboxOptions
}

export function Checkbox(options: CheckboxOptions): CheckboxDescriptor {
  return { type: Types.Checkbox, options }
}

export type DateValue = string

export type DateOptions = Options<{ preset?: DateValue }>

export type DateDescriptor<_T = DateValue> = { type: typeof Types.Date; options: DateOptions }

export function Date(options: DateOptions = {}): DateDescriptor {
  return { type: Types.Date, options }
}

export type ElementIDValue = string

type ElementIDOptions = Options<Record<string, never>>

type ElementIDDescriptor<_T = ElementIDValue> = {
  type: typeof Types.ElementID
  options: ElementIDOptions
}

export function ElementID(options: ElementIDOptions = {}): ElementIDDescriptor {
  return { type: Types.ElementID, options }
}

export type FontValue = ResponsiveValue<string>

type FontOptions = Options<{ preset?: FontValue; label?: string }>

type FontDescriptor<_T = FontValue> = { type: typeof Types.Font; options: FontOptions }

export function Font(options: FontOptions = {}): FontDescriptor {
  return { type: Types.Font, options }
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

export function GapY(options: GapYOptions = {}): GapYDescriptor {
  return { type: Types.GapY, options }
}

type GridColumn = { count: number; spans: number[][] }

export type GridValue = { elements: Element[]; columns: ResponsiveValue<GridColumn> }

type GridOptions = Options<Record<string, never>>

type GridDescriptor<_T = GridValue> = { type: typeof Types.Grid; options: GridOptions }

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

export function Image(options: ImageOptions = {}): ImageDescriptor {
  return { type: Types.Image, version: 1, options }
}

export type ImagesValueV0Item = {
  key: string
  props: {
    link?: Link
    file?: ImageValueV0
    altText?: string
  }
}

export type ImagesValueV1Item = {
  key: string
  version: 1
  props: {
    link?: Link
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

export function Images(options: ImagesOptions = {}): ImagesDescriptor {
  return { type: Types.Images, version: 1, options }
}

export type LinkValue = Link

export type LinkOptions = Options<{
  preset?: LinkValue
  label?: string
  defaultValue?: Link
  options?: { value: Link['type']; label: string }[]
  hidden?: boolean
}>

export type LinkDescriptor<_T = LinkValue> = { type: typeof Types.Link; options: LinkOptions }

export function Link(options: LinkOptions = {}): LinkDescriptor {
  return { type: Types.Link, options }
}

type ListValueItem<T extends Data> = { id: string; value?: T }

export type ListValue<T extends Data = Data> = ListValueItem<T>[]

export type ListOptions<T extends Data> = {
  type: PanelDescriptor<T>
  label?: string
  getItemLabel?: ((value: T | undefined) => string) | ((value: T | undefined) => Promise<string>)
  preset?: ListValue<T>
  defaultValue?: ListValue<T>
}

export type ListDescriptor<T extends ListValue = ListValue> = {
  type: typeof Types.List
  options: ListOptions<T extends ListValue<infer U> ? U : never>
}

export function List<T extends Data>(options: ListOptions<T>): ListDescriptor<ListValue<T>> {
  return { type: Types.List, options }
}

export function introspectListPropControllerData<T>(
  descriptor: ListDescriptor,
  value: ListValue | undefined,
  func: (definition: Descriptor, data: Data) => T[],
): T[] {
  if (value == null) return []

  return value.flatMap(item => (item.value ? func(descriptor.options.type, item.value) : []))
}

export function getListPropControllerElementChildren<T>(
  descriptor: ListDescriptor<T extends ListValue<Data> ? T : ListValue<Data>>,
  value: ListValue | undefined,
) {
  return introspectListPropControllerData(descriptor, value, getElementChildren)
}

export function getListPropControllerSwatchIds<T>(
  descriptor: ListDescriptor<T extends ListValue<Data> ? T : ListValue<Data>>,
  value: ListValue | undefined,
) {
  return introspectListPropControllerData(descriptor, value, getSwatchIds)
}

export function getListPropControllerFileIds<T>(
  descriptor: ListDescriptor<T extends ListValue<Data> ? T : ListValue<Data>>,
  value: ListValue | undefined,
) {
  return introspectListPropControllerData(descriptor, value, getFileIds)
}

export function getListPropControllerTypographyIds<T>(
  descriptor: ListDescriptor<T extends ListValue<Data> ? T : ListValue<Data>>,
  value: ListValue | undefined,
) {
  return introspectListPropControllerData(descriptor, value, getTypographyIds)
}

export function getListPropControllerPageIds<T>(
  descriptor: ListDescriptor<T extends ListValue<Data> ? T : ListValue<Data>>,
  value: ListValue | undefined,
) {
  return introspectListPropControllerData(descriptor, value, getPageIds)
}

type MarginSide = { value: number; unit: 'px' } | 'auto'

type Margin = {
  [K in 'top' | 'right' | 'bottom' | 'left' as `margin${Capitalize<K>}`]:
    | MarginSide
    | null
    | undefined
}

export type MarginValue = ResponsiveValue<Margin>

export const MarginPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::margin::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers::margin::format::responsive-value',
} as const

export type MarginPropControllerFormat =
  typeof MarginPropControllerFormat[keyof typeof MarginPropControllerFormat]

type MarginOptions = { preset?: MarginValue; format?: MarginPropControllerFormat }

export type MarginDescriptor<_T = MarginValue, U extends MarginOptions = MarginOptions> = {
  type: typeof Types.Margin
  options: U
}

export function Margin<T extends MarginOptions>(
  options: T & MarginOptions = {} as T,
): MarginDescriptor<MarginValue, T> {
  return { type: Types.Margin, options }
}

Margin.Format = MarginPropControllerFormat

type ButtonVariant = 'flat' | 'outline' | 'shadow' | 'clear' | 'blocky' | 'bubbly' | 'skewed'

type ButtonShape = 'pill' | 'rounded' | 'square'

type ButtonSize = 'small' | 'medium' | 'large'

export type NavigationButton = {
  id: string
  type: 'button'
  payload: {
    label: string
    link?: Link
    variant?: ResponsiveValue<ButtonVariant>
    shape?: ResponsiveValue<ButtonShape>
    size?: ResponsiveValue<ButtonSize>
    textColor?: ResponsiveValue<Color>
    color?: ResponsiveValue<Color>
    textStyle?: ResponsiveValue<TextStyle>
  }
}

type NavigationDropdownCaretType = 'caret' | 'plus' | 'arrow-down' | 'chevron-down'

type NavigationDropdownLink = {
  id: string
  payload: {
    label: string
    link?: Link
    color?: ResponsiveValue<Color>
    textStyle?: ResponsiveValue<TextStyle>
  }
}

type NavigationDropdown = {
  id: string
  type: 'dropdown'
  payload: {
    label: string
    caret?: NavigationDropdownCaretType
    links?: NavigationDropdownLink[]
    variant?: ResponsiveValue<ButtonVariant>
    shape?: ResponsiveValue<ButtonShape>
    size?: ResponsiveValue<ButtonSize>
    textColor?: ResponsiveValue<Color>
    color?: ResponsiveValue<Color>
    textStyle?: ResponsiveValue<TextStyle>
  }
}

export type NavigationLinksValue = (NavigationButton | NavigationDropdown)[]

type NavigationLinksOptions = Options<Record<string, never>>

type NavigationLinksDescriptor<_T = NavigationLinksValue> = {
  type: typeof Types.NavigationLinks
  options: NavigationLinksOptions
}

export function NavigationLinks(options: NavigationLinksOptions = {}): NavigationLinksDescriptor {
  return { type: Types.NavigationLinks, options }
}

export type NumberValue = number

export type NumberOptions = Options<{
  preset?: NumberValue
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}>

export type NumberDescriptor<_T = NumberValue> = {
  type: typeof Types.Number
  options: NumberOptions
}

export function Number(options: NumberOptions = {}): NumberDescriptor {
  return { type: Types.Number, options }
}

type PaddingSide = { value: number; unit: 'px' }

type Padding = {
  [K in 'top' | 'right' | 'bottom' | 'left' as `padding${Capitalize<K>}`]:
    | PaddingSide
    | null
    | undefined
}

export type PaddingValue = ResponsiveValue<Padding>

export const PaddingPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::padding::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers::padding::format::responsive-value',
} as const

export type PaddingPropControllerFormat =
  typeof PaddingPropControllerFormat[keyof typeof PaddingPropControllerFormat]

type PaddingOptions = { preset?: PaddingValue; format?: PaddingPropControllerFormat }

export type PaddingDescriptor<_T = PaddingValue, U extends PaddingOptions = PaddingOptions> = {
  type: typeof Types.Padding
  options: U
}

export function Padding<T extends PaddingOptions>(
  options: T & PaddingOptions = {} as T,
): PaddingDescriptor<PaddingValue, T> {
  return { type: Types.Padding, options }
}

Padding.Format = PaddingPropControllerFormat

export type ResponsiveColorValue = ResponsiveValue<Color>

type ResponsiveColorOptions = Options<{ label?: string; placeholder?: string; hidden?: boolean }>

export type ResponsiveColorDescriptor<_T = ResponsiveColorValue> = {
  type: typeof Types.ResponsiveColor
  options: ResponsiveColorOptions
}

export function ResponsiveColor(options: ResponsiveColorOptions = {}): ResponsiveColorDescriptor {
  return { type: Types.ResponsiveColor, options }
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
export function ResponsiveIconRadioGroup<_T extends string, T extends _T, U extends T>(
  options: ResponsiveIconRadioGroupOptions<T, U>,
): ResponsiveIconRadioGroupDescriptor<ResponsiveIconRadioGroupValue<T>> {
  return { type: Types.ResponsiveIconRadioGroup, options }
}

export type ResponsiveLengthValue = ResponsiveValue<Length>

export type LengthOption =
  | { value: 'px'; label: 'Pixels'; icon: 'Px16' }
  | { value: '%'; label: 'Percentage'; icon: 'Percent16' }

export type ResponsiveLengthOptions = Options<{
  label?: string
  options?: LengthOption[]
  defaultValue?: Length
  hidden?: boolean
}>

export type ResponsiveLengthDescriptor<_T = ResponsiveLengthValue> = {
  type: typeof Types.ResponsiveLength
  options: ResponsiveLengthOptions
}

export function ResponsiveLength(
  options: ResponsiveLengthOptions = {},
): ResponsiveLengthDescriptor {
  return { type: Types.ResponsiveLength, options }
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

export function RichText(options: RichTextOptions = {}): RichTextDescriptor {
  return { type: Types.RichText, options }
}

type Shadow = {
  color?: Color | null
  blurRadius?: number
  spreadRadius?: number
  offsetX?: number
  offsetY?: number
  inset?: boolean
}

type Shadows = { id: string; payload: Shadow }[]

export type ShadowsValue = ResponsiveValue<Shadows>

export const ShadowsPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::shadows::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers::shadows::format::responsive-value',
} as const

export type ShadowsPropControllerFormat =
  typeof ShadowsPropControllerFormat[keyof typeof ShadowsPropControllerFormat]

type ShadowsOptions = { format?: ShadowsPropControllerFormat }

export type ShadowsDescriptor<_T = ShadowsValue, U extends ShadowsOptions = ShadowsOptions> = {
  type: typeof Types.Shadows
  options: U
}

export function Shadows<T extends ShadowsOptions>(
  options: T & ShadowsOptions = {} as T,
): ShadowsDescriptor<ShadowsValue, T> {
  return { type: Types.Shadows, options }
}

Shadows.Format = ShadowsPropControllerFormat

export type ShapeValue<T extends Data = Data> = Record<string, T>

type ShapeOptions<T extends Record<string, PanelDescriptor>> = {
  type: T
  preset?: { [K in keyof T]?: DescriptorValueType<T[K]> }
}

export type ShapeDescriptor<
  _T extends Record<string, Data>,
  U extends Record<string, PanelDescriptor>,
> = {
  type: typeof Types.Shape
  options: ShapeOptions<U>
}

export function Shape<T extends Record<string, PanelDescriptor>>(
  options: ShapeOptions<T>,
): ShapeDescriptor<{ [K in keyof T]?: DescriptorValueType<T[K]> }, T> {
  return { type: Types.Shape, options }
}

export function introspectShapePropControllerData<T>(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
  func: (definition: Descriptor, data: Data) => T[],
): T[] {
  if (value == null) return []

  return Object.entries(descriptor.options.type).flatMap(([key, definition]) =>
    func(definition, value[key]),
  )
}

export function getShapePropControllerElementChildren(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
): Element[] {
  return introspectShapePropControllerData(descriptor, value, getElementChildren)
}

export function getShapePropControllerFileIds(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
): string[] {
  return introspectShapePropControllerData(descriptor, value, getFileIds)
}

export function getShapePropControllerTypographyIds(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
): string[] {
  return introspectShapePropControllerData(descriptor, value, getTypographyIds)
}

export function getShapePropControllerPageIds(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
): string[] {
  return introspectShapePropControllerData(descriptor, value, getPageIds)
}

export function getShapePropControllerSwatchIds(
  descriptor: ShapeDescriptor<Record<string, Data>, Record<string, PanelDescriptor>>,
  value: ShapeValue | undefined,
): string[] {
  return introspectShapePropControllerData(descriptor, value, getSwatchIds)
}

type SocialLinkType =
  | 'angellist'
  | 'codepen'
  | 'dribbble'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'medium'
  | 'pinterest'
  | 'reddit'
  | 'rss'
  | 'slack'
  | 'snapchat'
  | 'soundcloud'
  | 'spotify'
  | 'telegram'
  | 'tumblr'
  | 'twitch'
  | 'twitter'
  | 'vimeo'
  | 'whatsapp'
  | 'x'
  | 'yelp'
  | 'youtube'

type SocialLink = { type: SocialLinkType; url: string }

type SocialLinksLink = { id: string; payload: SocialLink }

export type SocialLinksValue = { links: SocialLinksLink[]; openInNewTab: boolean }

type SocialLinksOptions = Options<{ preset?: SocialLinksValue }>

type SocialLinksDescriptor<_T = SocialLinksValue> = {
  type: typeof Types.SocialLinks
  options: SocialLinksOptions
}

export function SocialLinks(options: SocialLinksOptions = {}): SocialLinksDescriptor {
  return { type: Types.SocialLinks, options }
}

export type TableValue = string

type TableOptions = Options<{ preset?: TableValue }>

type TableDescriptor<_T = TableValue> = { type: typeof Types.Table; options: TableOptions }

export function Table(options: TableOptions = {}): TableDescriptor {
  return { type: Types.Table, options }
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

export function TableFormFields(options: TableFormFieldsOptions = {}): TableFormFieldsDescriptor {
  return { type: Types.TableFormFields, options }
}

export type TypeaheadValue<T extends Data = Data> = {
  id: string
  label: string
  value: T
}

export type TypeaheadOptions<T extends Data> = {
  getItems: (query: string) => Promise<TypeaheadValue<T>[]>
  label?: string
  preset?: TypeaheadValue<T>
  defaultValue?: TypeaheadValue<T>
}

export type TypeaheadDescriptor<T extends TypeaheadValue = TypeaheadValue> = {
  type: typeof Types.Typeahead
  options: TypeaheadOptions<T extends TypeaheadValue<infer U> ? U : never>
}

export function Typeahead<T extends Data>(
  options: TypeaheadOptions<T>,
): TypeaheadDescriptor<TypeaheadValue<T>> {
  return { type: Types.Typeahead, options }
}

export type TextAreaValue = string

type TextAreaOptions = Options<{ preset?: TextAreaValue; label?: string; rows?: number }>

type TextAreaDescriptor<_T = TextAreaValue> = {
  type: typeof Types.TextArea
  options: TextAreaOptions
}

export function TextArea(options: TextAreaOptions = {}): TextAreaDescriptor {
  return { type: Types.TextArea, options }
}

export type TextInputValue = string

export type TextInputOptions = Options<{ label?: string; placeholder?: string; hidden?: boolean }>

export type TextInputDescriptor<_T = TextInputValue> = {
  type: typeof Types.TextInput
  options: TextInputOptions
}

export function TextInput(options: TextInputOptions = {}): TextInputDescriptor {
  return { type: Types.TextInput, options }
}

export type TextStyleValue = ResponsiveValue<TextStyle>

export type TextStyleOptions = Options<{
  preset?: TextStyleValue
  label?: string
  hidden?: boolean
}>

export type TextStyleDescriptor<_T = TextStyleValue> = {
  type: typeof Types.TextStyle
  options: TextStyleOptions
}

export function TextStyle(options: TextStyleOptions = {}): TextStyleDescriptor {
  return { type: Types.TextStyle, options }
}

type Video = {
  url?: string
  muted?: boolean
  playing?: boolean
  loop?: boolean
  controls?: boolean
}

export type VideoValue = Video

type VideoOptions = Options<{ preset?: VideoValue }>

type VideoDescriptor<_T = VideoValue> = { type: typeof Types.Video; options: VideoOptions }

export function Video(options: VideoOptions = {}): VideoDescriptor {
  return { type: Types.Video, options }
}

export type WidthValue = ResponsiveValue<Length>

export const WidthPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::width::format::class-name',
  ResponsiveValue: 'makeswift::prop-controllers::width::format::responsive-value',
} as const

type WidthControlValueFormat =
  typeof WidthPropControllerFormat[keyof typeof WidthPropControllerFormat]

type WidthOptions = {
  preset?: WidthValue
  defaultValue?: Length
  format?: WidthControlValueFormat
}

export type WidthDescriptor<_T = WidthValue, U extends WidthOptions = WidthOptions> = {
  type: typeof Types.Width
  options: U
}

export function Width<T extends WidthOptions>(
  options: T & WidthOptions = {} as T,
): WidthDescriptor<WidthValue, T> {
  return { type: Types.Width, options }
}

Width.Format = WidthPropControllerFormat

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
  | ListDescriptor<T extends ListValue ? T : ListValue>
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
  | ShapeDescriptor<T extends ShapeValue ? T : ShapeValue, any>
  | SocialLinksDescriptor<T>
  | TableDescriptor<T>
  | TableFormFieldsDescriptor<T>
  | TypeaheadDescriptor<T extends TypeaheadValue ? T : TypeaheadValue>
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
  | typeof Types.Margin
  | typeof Types.Padding
  | typeof Types.Border
  | typeof Types.Shadows
  | typeof Types.GapY
  | typeof Types.GapX
  | typeof Types.BorderRadius
  | typeof Types.Checkbox
  | typeof Types.TextInput
  | typeof Types.Link
  | typeof Types.List
  | typeof Types.Shape
  | typeof Types.ResponsiveSelect
  | typeof Types.ResponsiveColor
  | typeof Types.TextStyle
  | typeof Types.Images
  | typeof Types.ResponsiveNumber
  | typeof Types.Number
  | typeof Types.Date
  | typeof Types.Font
  | typeof Types.TextArea
  | typeof Types.Table
  | typeof Types.Typeahead
  | typeof Types.RichText
  | typeof Types.Image
  | typeof Types.ResponsiveOpacity
  | typeof Types.SocialLinks
  | typeof Types.Video
  | typeof Types.NavigationLinks

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
  : T['type'] extends typeof Types.ResponsiveColor
  ? ResponsiveColor | null | undefined
  : T['type'] extends typeof Types.Width
  ? ResolveWidthControlValue<T>
  : T['type'] extends typeof Types.Padding
  ? ResolvePaddingControlValue<T>
  : T['type'] extends typeof Types.Margin
  ? ResolveMarginControlValue<T>
  : T['type'] extends typeof Types.BorderRadius
  ? ResolveBorderRadiusControlValue<T>
  : T['type'] extends typeof Types.Shadows
  ? ResolveShadowsControlValue<T>
  : T['type'] extends typeof Types.Border
  ? ResolveBorderControlValue<T>
  : T extends Descriptor<infer U>
  ? U | undefined
  : never

export type PanelDescriptorValueType<T extends PanelDescriptor> = T extends PanelDescriptor<infer U>
  ? U
  : never

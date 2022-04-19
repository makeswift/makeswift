import type * as Slate from 'slate'
import type { Element, Data } from '../state/react-page'

export type { Data }

// See https://github.com/microsoft/TypeScript/issues/15300
export type IndexSignatureHack<T> = T extends Record<string, any>
  ? { [K in keyof T]: IndexSignatureHack<T[K]> }
  : T

export type Device = 'desktop' | 'tablet' | 'mobile'

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

type BackgroundImage = {
  imageId: string
  position: BackgroundImagePosition
  size?: BackgroundImageSize
  repeat?: BackgroundImageRepeat
  opacity?: number
  parallax?: number
}

type ImageBackground = { type: 'image'; id: string; payload: BackgroundImage }

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

type BackgroundsDescriptor<_T = BackgroundsValue> = {
  type: typeof Types.Backgrounds
  options: BackgroundsOptions
}

export function Backgrounds(options: BackgroundsOptions = {}): BackgroundsDescriptor {
  return { type: Types.Backgrounds, options }
}

type BorderSideStyle = 'dashed' | 'dotted' | 'solid'

type BorderSide = { width: number | null | undefined; style: BorderSideStyle; color?: Color | null }

type Border = {
  [K in 'top' | 'right' | 'bottom' | 'left' as `border${Capitalize<K>}`]:
    | BorderSide
    | null
    | undefined
}

export type BorderValue = ResponsiveValue<Border>

type BorderOptions = Options<Record<string, never>>

type BorderDescriptor<_T = BorderValue> = { type: typeof Types.Border; options: BorderOptions }

export function Border(options: BorderOptions = {}): BorderDescriptor {
  return { type: Types.Border, options }
}

type BorderRadius = {
  [K in 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' as `border${Capitalize<K>}Radius`]:
    | Length
    | null
    | undefined
}

export type BorderRadiusValue = ResponsiveValue<BorderRadius>

type BorderRadiusOptions = Options<Record<string, never>>

type BorderRadiusDescriptor<_T = BorderRadiusValue> = {
  type: typeof Types.BorderRadius
  options: BorderRadiusOptions
}

export function BorderRadius(options: BorderRadiusOptions = {}): BorderRadiusDescriptor {
  return { type: Types.BorderRadius, options }
}

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

type DateOptions = Options<{ preset?: DateValue }>

type DateDescriptor<_T = DateValue> = { type: typeof Types.Date; options: DateOptions }

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

export type ImageValue = string

type ImageOptions = Options<{ label?: string; hidden?: boolean }>

type ImageDescriptor<_T = ImageValue> = { type: typeof Types.Image; options: ImageOptions }

export function Image(options: ImageOptions = {}): ImageDescriptor {
  return { type: Types.Image, options }
}

export type ImagesValue = { key: string; props: { link?: Link; file?: string; altText?: string } }[]

type ImagesOptions = Options<{ preset?: ImagesValue }>

type ImagesDescriptor<_T = ImagesValue> = { type: typeof Types.Images; options: ImagesOptions }

export function Images(options: ImagesOptions = {}): ImagesDescriptor {
  return { type: Types.Images, options }
}

export type LinkValue = Link

type LinkOptions = Options<{
  preset?: LinkValue
  label?: string
  defaultValue?: Link
  options?: { value: Link['type']; label: string }[]
  hidden?: boolean
}>

type LinkDescriptor<_T = LinkValue> = { type: typeof Types.Link; options: LinkOptions }

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

type MarginSide = { value: number; unit: 'px' } | 'auto'

type Margin = {
  [K in 'top' | 'right' | 'bottom' | 'left' as `margin${Capitalize<K>}`]:
    | MarginSide
    | null
    | undefined
}

export type MarginValue = ResponsiveValue<Margin>

type MarginOptions = Options<{ preset?: MarginValue }>

type MarginDescriptor<_T = MarginValue> = { type: typeof Types.Margin; options: MarginOptions }

export function Margin(options: MarginOptions = {}): MarginDescriptor {
  return { type: Types.Margin, options }
}

type ButtonVariant = 'flat' | 'outline' | 'shadow' | 'clear' | 'blocky' | 'bubbly' | 'skewed'

type ButtonShape = 'pill' | 'rounded' | 'square'

type ButtonSize = 'small' | 'medium' | 'large'

type NavigationButton = {
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

type NumberOptions = Options<{
  preset?: NumberValue
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}>

type NumberDescriptor<_T = NumberValue> = { type: typeof Types.Number; options: NumberOptions }

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

type PaddingOptions = Options<{ preset?: PaddingValue }>

type PaddingDescriptor<_T = PaddingValue> = { type: typeof Types.Padding; options: PaddingOptions }

export function Padding(options: PaddingOptions = {}): PaddingDescriptor {
  return { type: Types.Padding, options }
}

export type ResponsiveColorValue = ResponsiveValue<Color>

type ResponsiveColorOptions = Options<{ label?: string; placeholder?: string; hidden?: boolean }>

export type ResponsiveColorDescriptor<_T = ResponsiveColorValue> = {
  type: typeof Types.ResponsiveColor
  options: ResponsiveColorOptions
}

export function ResponsiveColor(options: ResponsiveColorOptions = {}): ResponsiveColorDescriptor {
  return { type: Types.ResponsiveColor, options }
}

type IconRadioGroupOption<T extends string> = { value: T; label: string; icon: IconName }

export type ResponsiveIconRadioGroupValue<T extends string> = ResponsiveValue<T>

type ResponsiveIconRadioGroupOptions<T extends string, U extends T = T> = Options<{
  label?: string
  options: IconRadioGroupOption<T>[]
  defaultValue?: U
  hidden?: boolean
}>

type ResponsiveIconRadioGroupDescriptor<T extends ResponsiveIconRadioGroupValue<string>> = {
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

type LengthOption =
  | { value: 'px'; label: 'Pixels'; icon: 'Px16' }
  | { value: '%'; label: 'Percentage'; icon: 'Percent16' }

type ResponsiveLengthOptions = Options<{
  label?: string
  options?: LengthOption[]
  defaultValue?: Length
  hidden?: boolean
}>

type ResponsiveLengthDescriptor<_T = ResponsiveLengthValue> = {
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

export type ResponsiveSelectValue<T extends string> = ResponsiveValue<T>

type SelectLabelOrientation = 'vertical' | 'horizontal'

type SelectOption<T extends string> = { value: T; label: string }

type ResponsiveSelectOptions<T extends string, U extends T = T> = Options<{
  label?: string
  labelOrientation?: SelectLabelOrientation
  options: SelectOption<T>[]
  defaultValue?: U
  hidden?: boolean
}>

type ResponsiveSelectDescriptor<T extends ResponsiveSelectValue<string>> = {
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

export type RichTextValue = IndexSignatureHack<Slate.ValueJSON>

type RichTextOptions = Options<{ preset?: RichTextValue }>

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

type ShadowsOptions = Options<Record<string, never>>

type ShadowsDescriptor<_T = ShadowsValue> = { type: typeof Types.Shadows; options: ShadowsOptions }

export function Shadows(options: ShadowsOptions = {}): ShadowsDescriptor {
  return { type: Types.Shadows, options }
}

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
  | 'snapchat'
  | 'soundcloud'
  | 'spotify'
  | 'telegram'
  | 'tumblr'
  | 'twitch'
  | 'twitter'
  | 'vimeo'
  | 'whatsapp'
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

type TextInputOptions = Options<{ label?: string; placeholder?: string; hidden?: boolean }>

type TextInputDescriptor<_T = TextInputValue> = {
  type: typeof Types.TextInput
  options: TextInputOptions
}

export function TextInput(options: TextInputOptions = {}): TextInputDescriptor {
  return { type: Types.TextInput, options }
}

export type TextStyleValue = ResponsiveValue<TextStyle>

type TextStyleOptions = Options<{ preset?: TextStyleValue; label?: string; hidden?: boolean }>

type TextStyleDescriptor<_T = TextStyleValue> = {
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

export const WidthControlValueFormats = {
  ClassName: 'ClassName',
  ResponsiveValue: 'ResponsiveValue',
} as const

type WidthControlValueFormat =
  typeof WidthControlValueFormats[keyof typeof WidthControlValueFormats]

type WidthOptions = Options<{
  preset?: WidthValue
  defaultValue?: Length
  format?: WidthControlValueFormat
}>

export type WidthDescriptor<_T = WidthValue, U extends WidthOptions = WidthOptions> = {
  type: typeof Types.Width
  options: U
}

export function Width<T extends WidthOptions>(
  options: T & WidthOptions = {} as T,
): WidthDescriptor<WidthValue, T> {
  return { type: Types.Width, options }
}

Width.Formats = WidthControlValueFormats

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

export type DescriptorValueType<T extends Descriptor> = T extends Descriptor<infer U> ? U : never

export type PanelDescriptorValueType<T extends PanelDescriptor> = T extends PanelDescriptor<infer U>
  ? U
  : never

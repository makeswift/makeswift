import { type Device, type ResponsiveValue } from '@makeswift/controls'

import { AssociatedType } from './utils/associated-types'

export {
  type CopyContext,
  type DataType,
  type Element,
  type ElementData,
  type MergeTranslatableDataContext,
  type ReplacementContext,
  type ResponsiveValue,
  Schema,
  ControlDataTypeKey,
  createReplacementContext,
  ContextResource,
  shouldRemoveResource,
  getReplacementResourceId,
} from '@makeswift/controls'

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
  Margin: 'Margin',
  NavigationLinks: 'NavigationLinks',
  Padding: 'Padding',
  Number: 'Number',
  Shadows: 'Shadows',
  ResponsiveColor: 'ResponsiveColor',
  ResponsiveIconRadioGroup: 'ResponsiveIconRadioGroup',
  ResponsiveLength: 'ResponsiveLength',
  ResponsiveNumber: 'ResponsiveNumber',
  ResponsiveOpacity: 'ResponsiveOpacity',
  ResponsiveSelect: 'ResponsiveSelect',
  SocialLinks: 'SocialLinks',
  TextArea: 'TextArea',
  TextInput: 'TextInput',
  Table: 'Table',
  TableFormFields: 'TableFormFields',
  TextStyle: 'TextStyle',
  Width: 'Width',
  Video: 'Video',
} as const

export type Options<T> =
  | T
  | ((props: Record<string, unknown>, deviceMode: Device) => T)

export type ResolveOptions<T extends Options<unknown>> =
  T extends Options<infer U> ? U : never

export type PropType<T> = AssociatedType<T, 'Type'>
export type PropData<T> = AssociatedType<T, 'PropData'>
export type Value<T> = AssociatedType<T, 'Value'>
export type Descriptor<T> = AssociatedType<T, 'Descriptor'>
export type Discriminator<T> = AssociatedType<T, 'Discriminator'>
export type OptionsType<T> = AssociatedType<Descriptor<T>, 'Options'>
export type RawOptionsType<T> = ResolveOptions<OptionsType<T>>

export type PrimitiveValue<T> =
  Value<T> extends ResponsiveValue<infer U> ? U : Value<T>

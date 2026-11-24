import { type Options, Types } from '../prop-controllers'
import { responsiveIconRadioGroupValueSchema } from '../data'
import {
  versionedPropDef,
  typeArg,
  type VersionedDescriptor,
} from '../versioned'

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

export type IconRadioGroupOption<T extends string> = {
  value: T
  label: string
  icon: IconName
}

export type RawIconRadioGroupOptions<
  T extends string = string,
  U extends T = T,
> = {
  label?: string
  options: IconRadioGroupOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

const discriminator = {
  version: 1,
  dataKey: 'prop-controllers::responsive-icon-radio-group::v1' as const,
}

export interface ResponsiveIconRadioGroupCtor {
  // HACK(miguel): We have to use a layer of indirection with `_T` and `T` because otherwise the
  // values provided would undergo type widening. For some reason, the extra layer of indirection
  // reuslts in TypeScript not widening types. Note, this only happens when the returned value of this
  // function is passed to another as an argument, which is common with the `registerComponent` API.
  /**
   * @deprecated Prop controllers are deprecated. Use `@makeswift/runtime/controls` instead.
   */
  <_T extends string, T extends _T, U extends T>(
    options: Options<RawIconRadioGroupOptions<T, U>>,
  ): VersionedDescriptor<
    typeof discriminator,
    typeof Types.ResponsiveIconRadioGroup,
    Options<RawIconRadioGroupOptions<T, U>>
  >
}

export const ResponsiveIconRadioGroup = versionedPropDef(
  Types.ResponsiveIconRadioGroup,
  responsiveIconRadioGroupValueSchema,
  discriminator,
  typeArg<RawIconRadioGroupOptions>(),
  typeArg<ResponsiveIconRadioGroupCtor>(),
)

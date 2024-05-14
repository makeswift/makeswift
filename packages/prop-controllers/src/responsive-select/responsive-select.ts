import { type Options, Types } from '../prop-controllers'
import { responsiveSelectValueSchema } from '../data'
import {
  versionedPropDef,
  typeArg,
  type VersionedDescriptor,
} from '../versioned'

export type SelectLabelOrientation = 'vertical' | 'horizontal'

export type SelectOption<T extends string> = { value: T; label: string }

export type RawSelectOptions<T extends string = string, U extends T = T> = {
  label?: string
  labelOrientation?: SelectLabelOrientation
  options: SelectOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

const discriminator = {
  version: 1,
  dataKey: 'prop-controllers::responsive-select::v1' as const,
}

export interface ResponsiveSelectCtor {
  // HACK(miguel): We have to use a layer of indirection with `_T` and `T` because otherwise the
  // values provided would undergo type widening. For some reason, the extra layer of indirection
  // reuslts in TypeScript not widening types. Note, this only happens when the returned value of this
  // function is passed to another as an argument, which is common with the `registerComponent` API.
  /**
   * @deprecated Prop controllers are deprecated. Use `@makeswift/runtime/controls` instead.
   */
  <_T extends string, T extends _T, U extends T>(
    options: Options<RawSelectOptions<T, U>>,
  ): VersionedDescriptor<
    typeof discriminator,
    typeof Types.ResponsiveSelect,
    Options<RawSelectOptions<T, U>>
  >
}

export const ResponsiveSelect = versionedPropDef(
  Types.ResponsiveSelect,
  responsiveSelectValueSchema,
  discriminator,
  typeArg<RawSelectOptions>(),
  typeArg<ResponsiveSelectCtor>(),
)

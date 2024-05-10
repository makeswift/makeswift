import { match } from 'ts-pattern'
import { z } from 'zod'
import {
  ControlDataTypeKey,
  Types,
  type Options,
  type PrimitiveValue,
  type ResponsiveValue,
} from './prop-controllers'
import { AssociatedType } from './utils/associated-types'

export type VersionDiscriminator<
  Version extends number = number,
  Key extends string = string,
> = {
  version: Version
  dataKey: Key
}

export type VersionedDescriptor<
  Discriminator = VersionDiscriminator,
  Type = string,
  Opts = Options<any>,
> = {
  type: Type
  options: Opts
} & (
  | Discriminator
  | {
      type: Type
      options: Opts
    }
)

type VersionedPropData<Value, Key extends string = string> =
  | Value
  | {
      [ControlDataTypeKey]: Key
      value: Value
    }

export abstract class PropDef<
  Type = string,
  Value = any,
  PropData extends VersionedPropData<Value> = VersionedPropData<Value>,
  Descriptor extends VersionedDescriptor = VersionedDescriptor,
> {
  readonly __associated_types__?: () => {
    Type: Type
    Value: Value
    PropData: PropData
    Descriptor: Descriptor
    Discriminator: VersionDiscriminator | {}
  }

  abstract get type(): Type
  abstract get schema(): z.ZodSchema

  abstract fromPropData(propData: PropData): Value
  abstract fromPropData(propData: PropData | undefined): Value | undefined
  abstract fromPropData<V extends PrimitiveValue<Value>>(
    propData: PropData | undefined,
  ): ResponsiveValue<V> | undefined

  abstract toPropData(
    data: Value,
    descriptor: VersionDiscriminator | {},
  ): PropData
}

type FillPresetType<RawOptions, Preset> = RawOptions extends {
  preset?: unknown
}
  ? RawOptions & { preset?: Preset }
  : RawOptions

type IfNullable<Opts extends Options<any>, R> =
  Opts extends Options<infer T>
    ? {} extends NonNullable<T>
      ? R
      : 'non-empty options are required'
    : never

type Select<T, U> = unknown extends T ? U : T

class TypeArg<T> {
  __associated_types__?: () => { T: T }
}

export const typeArg = <T>() => new TypeArg<T>()

export interface DefaultCtor<Opts, Descriptor> {
  /**
   * @deprecated Prop controllers are deprecated. Use `@makeswift/runtime/controls` instead.
   */
  (options: Opts): Descriptor

  /**
   * @deprecated Prop controllers are deprecated. Use `@makeswift/runtime/controls` instead.
   */
  (): IfNullable<Opts, Descriptor>
}

export const versionedPropDef = <
  Type extends keyof typeof Types,
  ValueSchema extends z.ZodTypeAny,
  Version extends number,
  Key extends string,
  RawOptions,
  Constructor,
>(
  type: Type,
  valueSchema: ValueSchema,
  discriminator: VersionDiscriminator<Version, Key>,
  _rawOptionsType: TypeArg<RawOptions>,
  _ctor?: TypeArg<Constructor>,
) => {
  const schemaV0 = valueSchema
  const schemaV1 = z.object({
    [ControlDataTypeKey]: z.literal(discriminator.dataKey),
    value: valueSchema,
  })

  const schema = z.union([schemaV0, schemaV1])

  type Value = z.infer<typeof valueSchema>
  type PropData = z.infer<typeof schema>
  type Opts = Options<FillPresetType<RawOptions, PropData>>
  type Discriminator = typeof discriminator
  type VersionDiscriminator = Discriminator | {}
  type Descriptor = VersionedDescriptor<Discriminator, Type, Opts> & {
    __associated_types__?: () => { Options: Opts; Value: Value }
  }

  type Ctor = Select<
    AssociatedType<typeof _ctor, 'T'>,
    DefaultCtor<Opts, Descriptor>
  >

  type Def = PropDef<Type, Value, PropData, Descriptor> &
    Ctor & {
      __associated_types__?: () => {
        Type: Type
        Value: Value
        PropData: PropData
        Descriptor: Descriptor
        Discriminator: VersionDiscriminator
      }

      readonly discriminator: Discriminator
    }

  const r = (options?: Opts): Descriptor => {
    return {
      type,
      version: discriminator.version,
      options: options ?? {},
    } as Descriptor
  }

  r.schema = schema
  r.type = type
  r.discriminator = discriminator

  r.fromPropData = (propData: PropData | undefined): Value | undefined =>
    match(propData)
      .with(
        {
          [ControlDataTypeKey]: discriminator.dataKey,
        } as any,
        (v1) => v1.value,
      )
      .otherwise((v0) => v0)

  r.toPropData = (data: Value, descriptor: VersionDiscriminator) =>
    match(descriptor)
      .with(
        { version: discriminator.version } as any,
        () =>
          ({
            [ControlDataTypeKey]: discriminator.dataKey,
            value: data,
          }) as const,
      )
      .otherwise(() => data)

  return r as Def
}

import { match } from 'ts-pattern'
import { z } from 'zod'
import { type Options, ControlDataTypeKey, Types } from './prop-controllers'

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
> extends Function {
  readonly __associated_types__?: () => {
    Type: Type
    Value: Value
    PropData: PropData
    Descriptor: Descriptor
    Discriminator: VersionDiscriminator | {}
  }

  readonly _callable

  constructor() {
    super('...args', 'return this._callable.__call__(...args)')
    this._callable = this.bind(this)
    return this._callable
  }

  abstract get type(): Type
  abstract get schema(): z.ZodSchema

  abstract fromPropData(propData: PropData): Value
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

export const versionedPropDef =
  <RawOptions>() =>
  <
    Type extends keyof typeof Types,
    ValueSchema extends z.ZodTypeAny,
    Version extends number,
    Key extends string,
  >(
    type: Type,
    valueSchema: ValueSchema,
    discriminator: VersionDiscriminator<Version, Key>,
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

    interface Def {
      /**
       * @deprecated Prop controllers are deprecated. Use `@makeswift/runtime/controls` instead.
       */
      (options: Opts): Descriptor
      (): IfNullable<Opts, Descriptor>
    }

    class Def extends PropDef<Type, Value, PropData, Descriptor> {
      declare __associated_types__?: () => {
        Type: Type
        Value: Value
        PropData: PropData
        Descriptor: Descriptor
        Discriminator: VersionDiscriminator
      }

      readonly schemaV0 = schemaV0
      readonly schemaV1 = schemaV1
      readonly schema = schema

      readonly type = type
      readonly discriminator = discriminator

      __call__(options?: Opts) {
        return {
          type,
          version: discriminator.version,
          options: options ?? ({} as any),
        } satisfies Descriptor
      }

      fromPropData(propData: PropData): Value {
        return match(propData)
          .with(
            {
              [ControlDataTypeKey]: discriminator.dataKey,
            } as any,
            (v1) => v1.value,
          )
          .otherwise((v0) => v0)
      }

      toPropData(data: Value, descriptor: VersionDiscriminator) {
        return match(descriptor)
          .with(
            { version: discriminator.version } as any,
            () =>
              ({
                [ControlDataTypeKey]: discriminator.dataKey,
                value: data,
              }) as const,
          )
          .otherwise(() => data)
      }
    }

    return new Def()
  }

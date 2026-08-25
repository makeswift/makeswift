import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { Schema, type Data } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import {
  ContextValueSchema,
  type AnyContextValue,
  type ContextValueDependencies,
  type ContextValues,
  type DependsOnConfig,
  type ProvidesConfig,
} from '../context-value'
import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

export type GalleryOption<T extends Data = Data> = {
  id: string
  thumbnailUrl: string
  label?: string
  value: T
}
export type GalleryPage<T extends Data = Data> = {
  options: GalleryOption<T>[]
}

type GetOptionsType<T extends Data, D extends ContextValueDependencies> = (
  context: ContextValues<D>,
) => GalleryPage<T> | Promise<GalleryPage<T>>

type Config<
  T extends Data = Data,
  D extends ContextValueDependencies = {},
  P extends AnyContextValue = AnyContextValue,
> = ProvidesConfig<P> &
  DependsOnConfig<D> & {
    label?: string
    description?: string
    getOptions: GetOptionsType<T, D>
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = Config<any, any, any>

type ItemType<C extends AnyConfig> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends Config<infer Item, any, any> ? Item : never
type DataType<C extends AnyConfig> = GalleryOption<ItemType<C>>
type ValueType<C extends AnyConfig> = DataType<C>
type ResolvedValueType<C extends AnyConfig> =
  | GalleryOption<ItemType<C>>['value']
  | undefined

class Definition<C extends AnyConfig> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::gallery' as const

  static schema<T extends Data>(item: SchemaType<T>) {
    const type = z.literal(Definition.type)

    const option = z.object({
      id: z.string(),
      thumbnailUrl: z.string(),
      label: z.string().optional(),
      value: item,
    }) as SchemaType<GalleryOption<T>>

    const data = option
    const value = data
    const resolvedValue = item.optional()

    const options = z.array(option)
    const page = z.object({ options })

    const config = z.object({
      getOptions: z
        .function()
        .args(ContextValueSchema.contextValues)
        .returns(z.union([page, z.promise(page)])),
      provides: ContextValueSchema.provides.optional(),
      dependsOn: ContextValueSchema.dependsOn.optional(),
      label: z.string().optional(),
      description: z.string().optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    return {
      type,
      data,
      value,
      resolvedValue,
      config,
      definition,
    }
  }

  static deserialize(data: DeserializedRecord): unstable_GalleryDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Gallery: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema(Schema.data).definition.parse(data)

    return unstable_Gallery(config as Config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema(Schema.data as SchemaType<ItemType<C>>)
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return data
  }

  toData(value: ValueType<C>): DataType<C> {
    return value
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    return data
  }

  resolveValueFromData(
    data: DataType<C> | undefined,
  ): ResolvedValueType<C> | undefined {
    return this.fromData(data)?.value
  }

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      name: Definition.type,
      readStable: () => this.resolveValueFromData(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitGallery(this, ...args)
  }
}

export class unstable_GalleryDefinition<
  C extends AnyConfig = Config,
> extends Definition<C> {}

type NormedConfig<
  T extends Data,
  D extends ContextValueDependencies,
  P extends AnyContextValue,
  GetOptions extends GetOptionsType<T, D>,
> = Config<T, D, P> & {
  getOptions: GetOptions
}

export function unstable_Gallery<
  T extends Data,
  D extends ContextValueDependencies = {},
  P extends AnyContextValue = never,
  GetOptions extends GetOptionsType<T, D> = GetOptionsType<T, D>,
>(
  config: Config<T, D, P> & { getOptions: GetOptions },
): unstable_GalleryDefinition<NormedConfig<T, D, P, GetOptions>> {
  return new unstable_GalleryDefinition(config)
}

export { type Config as GalleryConfig }

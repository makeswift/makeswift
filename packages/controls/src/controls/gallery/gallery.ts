import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { Schema, type Data } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

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

type GetOptionsType<T extends Data> = () =>
  | GalleryPage<T>
  | Promise<GalleryPage<T>>

type Config<T extends Data = Data> = {
  label?: string
  description?: string
  getOptions: GetOptionsType<T>
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = GalleryOption<ItemType<C>>
type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> =
  | GalleryOption<ItemType<C>>['value']
  | undefined

class Definition<C extends Config> extends ControlDefinition<
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
        .args()
        .returns(z.union([page, z.promise(page)])),
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

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      name: Definition.type,
      readStable: () => this.fromData(data)?.value,
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
  C extends Config = Config,
> extends Definition<C> {}

type NormedConfig<
  T extends Data,
  GetOptions extends GetOptionsType<T>,
> = Config<T> & {
  getOptions: GetOptions
}

export function unstable_Gallery<
  T extends Data,
  GetOptions extends GetOptionsType<T>,
>(
  config: Config<T> & { getOptions: GetOptions },
): unstable_GalleryDefinition<NormedConfig<T, GetOptions>> {
  return new unstable_GalleryDefinition(config)
}

export { type Config as GalleryConfig }

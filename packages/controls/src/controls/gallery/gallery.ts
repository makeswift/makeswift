import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

export type GalleryOption = { id: string; src: string; label?: string }
export type GalleryPage<O extends GalleryOption = GalleryOption> = {
  options: O[]
}

type GetOptionsType<O extends GalleryOption> = () =>
  | GalleryPage<O>
  | Promise<GalleryPage<O>>

type Config<O extends GalleryOption = GalleryOption> = {
  label?: string
  description?: string
  getOptions: GetOptionsType<O>
}

type OptionType<C extends Config> = C extends Config<infer O> ? O : never
type DataType<C extends Config> = OptionType<C> | undefined
type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> = ValueType<C>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::gallery' as const

  static schema<O, D>(option: SchemaType<O>, data: SchemaType<D>) {
    const type = z.literal(Definition.type)

    const value = data
    const resolvedValue = data

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

    const option = z
      .object({
        id: z.string(),
        src: z.string(),
        label: z.string().optional(),
      })
      .passthrough()

    const { config } = Definition.schema(
      option,
      option.optional(),
    ).definition.parse(data)

    return unstable_Gallery(config as Config)
  }

  get controlType() {
    return Definition.type
  }

  get optionSchema(): SchemaType<OptionType<C>> {
    return z
      .object({
        id: z.string(),
        src: z.string(),
        label: z.string().optional(),
      })
      .passthrough() as unknown as SchemaType<OptionType<C>>
  }

  get schema() {
    return Definition.schema(
      this.optionSchema,
      this.optionSchema.optional() as SchemaType<DataType<C>>,
    )
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.optionSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.optionSchema.optional().parse(data) as ValueType<C> | undefined
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
      readStable: () => this.fromData(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitGallery(this, ...args)
  }
}

export class unstable_GalleryDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type NormedConfig<
  O extends GalleryOption,
  GetOptions extends GetOptionsType<O>,
> = Config<O> & {
  getOptions: GetOptions
}

export function unstable_Gallery<
  O extends GalleryOption,
  GetOptions extends GetOptionsType<O>,
>(
  config: Config<O> & { getOptions: GetOptions },
): unstable_GalleryDefinition<NormedConfig<O, GetOptions>> {
  return new unstable_GalleryDefinition(config)
}

export { type Config as GalleryConfig }

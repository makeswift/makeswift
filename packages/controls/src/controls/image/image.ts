import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import {
  getReplacementFileId,
  shouldRemoveFile,
  type CopyContext,
} from '../../context'
import { IntrospectionTarget, Targets } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

type Config = z.infer<typeof Definition.schema.config>
type DefaultConfig = Config & {
  format: typeof Definition.Format.WithDimensions | typeof Definition.Format.URL
}

type BaseSchema = typeof Definition.schema
type SchemaByFormat<F extends Config['format']> = undefined extends F
  ? BaseSchema['url']
  :
        | typeof Definition.Format.WithDimensions
        | typeof Definition.Format.URL extends F
    ? BaseSchema['withDimensions'] | BaseSchema['url']
    : F extends typeof Definition.Format.WithDimensions
      ? BaseSchema['withDimensions']
      : F extends typeof Definition.Format.URL
        ? BaseSchema['url']
        : never

type Schema<C extends Config> = SchemaByFormat<C['format']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type ReturnedSchemaType<C extends Config> = {
  definition: typeof Definition.schema.definition
  type: typeof Definition.schema.type
  data: SchemaType<DataType<C>>
  value: SchemaType<ValueType<C>>
  resolvedValue: SchemaType<ResolvedValueType<C>>
}

class Definition<C extends Config = DefaultConfig> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  private static readonly dataSignature = {
    makeswiftFile: { type: 'makeswift-file' },
    externalFile: { type: 'external-file' },
  } as const

  static readonly type = 'makeswift::controls::image' as const
  static readonly Format = {
    URL: `${this.type}::format::url`,
    WithDimensions: `${this.type}::format::with-dimensions`,
  } as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()

    const makeswiftFileValue = z.object({
      type: z.literal(this.dataSignature.makeswiftFile.type),
      id: z.string(),
    })

    const externalFileValue = z.object({
      type: z.literal(this.dataSignature.externalFile.type),
      url: z.string(),
      width: z.number().nullable().optional(),
      height: z.number().nullable().optional(),
    })

    const makeswiftFileData = makeswiftFileValue.merge(
      z.object({
        version: z.literal(1),
      }),
    )

    const externalFileData = externalFileValue.merge(
      z.object({
        version: z.literal(1),
      }),
    )

    const data = z.union([
      z.string(),
      z.union([makeswiftFileData, externalFileData]),
    ])

    const value = z.union([makeswiftFileValue, externalFileValue])

    const config = z.object({
      label: z.string().optional(),
      format: z
        .union([
          z.literal(this.Format.URL),
          z.literal(this.Format.WithDimensions),
        ])
        .optional(),
    })

    const definition = z.object({
      type,
      config,
      version,
    })

    const schemas = <R>(resolvedValue: SchemaType<R>) => ({
      type,
      config,
      definition,
      data,
      value,
      resolvedValue,
      version,
    })

    const url = z.string()
    const urlWithDimensions = z.object({
      url,
      dimensions: z.object({
        width: z.number(),
        height: z.number(),
      }),
    })

    return {
      type,
      version,
      config,
      definition,
      url: schemas(url.optional()),
      withDimensions: schemas(urlWithDimensions.optional()),
    }
  }

  static deserialize(data: DeserializedRecord): ImageDefinition<Config> {
    if (data.type !== Definition.type)
      throw new Error(
        `Image deserialization: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.definition.parse(data)
    return new ImageDefinition<Config>(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<typeof Definition.schema.version>,
  ) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema(): ReturnedSchemaType<C> {
    const { url, withDimensions, ...baseSchema } = Definition.schema
    return {
      ...baseSchema,
      value: z.union([url.value, withDimensions.value]),
      data: z.union([url.data, withDimensions.data]),
      resolvedValue: z.union([url.resolvedValue, withDimensions.resolvedValue]),
    }
  }

  get refinedSchema() {
    return match(this.config.format)
      .with(Definition.Format.URL, () => Definition.schema.url)
      .with(
        Definition.Format.WithDimensions,
        () => Definition.schema.withDimensions,
      )
      .with(undefined, () => Definition.schema.url)
      .exhaustive() as Schema<C>
  }

  get dataSchema() {
    return this.refinedSchema.data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(
        Definition.dataSignature.makeswiftFile,
        ({ version, ...value }) => value,
      )
      .with(
        Definition.dataSignature.externalFile,
        ({ version, ...value }) => value,
      )
      .with(P.string, (value) => ({
        ...Definition.dataSignature.makeswiftFile,
        id: value,
      }))
      .otherwise(() => undefined)
  }

  toData(value: ValueType<C>): DataType<C> {
    const version = this.version
    return match({
      version,
      value: value satisfies z.infer<typeof this.refinedSchema.value>,
    })
      .with(
        {
          version: 1,
          value: Definition.dataSignature.makeswiftFile,
        },
        ({ value, version }) => ({ ...value, version }),
      )
      .with(
        {
          version: 1,
          value: Definition.dataSignature.externalFile,
        },
        ({ value, version }) => ({ ...value, version }),
      )
      .with(
        {
          version: P.nullish,
          value: Definition.dataSignature.makeswiftFile,
        },
        ({ value }) => value.id,
      )
      .otherwise(() => {
        throw new Error(
          `Invalid ValueType for Image v${this.version ?? 0}: ${JSON.stringify(value)}`,
        )
      })
  }

  copyData(
    data: DataType<C> | undefined,
    ctx: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const fileResourceId = match(data satisfies z.infer<typeof this.dataSchema>)
      .with(P.string, (id) => id)
      .with(Definition.dataSignature.makeswiftFile, ({ id }) => id)
      .otherwise(() => undefined)

    if (fileResourceId != null && shouldRemoveFile(fileResourceId, ctx)) {
      return undefined
    }

    const inputSchema = this.dataSchema.optional()

    return match(data satisfies z.infer<typeof inputSchema>)
      .with(P.string, (id) => getReplacementFileId(id, ctx) ?? id)
      .with(Definition.dataSignature.makeswiftFile, (data) => ({
        ...data,
        id: getReplacementFileId(data.id, ctx) ?? data.id,
      }))
      .otherwise((val) => val)
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const dataSchema = this.dataSchema.optional()

    const externalFile = match(data satisfies z.infer<typeof dataSchema>)
      .with(Definition.dataSignature.externalFile, (val) => val)
      .otherwise(() => null)

    if (externalFile != null) {
      const stableValue = StableValue({
        name: Definition.type,
        read: () => this.resolveImage(externalFile),
      })

      return {
        ...stableValue,
        triggerResolve: async () => {},
      }
    }

    const fileId = match(data satisfies z.infer<typeof dataSchema>)
      .with(P.string, (id) => id)
      .with(Definition.dataSignature.makeswiftFile, ({ id }) => id)
      .otherwise(() => undefined)

    const fileSub = resolver.resolveFile(fileId)
    const stableValue = StableValue({
      name: Definition.type,
      read: () => {
        const file = fileSub.readStable()
        return file != null
          ? this.resolveImage({
              url: file.publicUrl,
              width: file.dimensions?.width,
              height: file.dimensions?.height,
            })
          : undefined
      },
      deps: [fileSub],
    })

    return {
      ...stableValue,
      triggerResolve: async (currentValue) => {
        if (currentValue == null) {
          await fileSub.fetch()
        }
      },
    }
  }

  resolveImage({
    url,
    width,
    height,
  }: {
    url: string
    width?: number | null
    height?: number | null
  }): ResolvedValueType<C> {
    const format = this.config.format
    if (format === Definition.Format.URL || format == null) {
      return url
    }

    return width != null && height != null
      ? {
          url,
          dimensions: { width, height },
        }
      : undefined
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }

  introspect<R>(
    data: DataType<C> | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    if (target.type !== Targets.File.type) return []

    const dataSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof dataSchema>)
      .with(P.string, (id) => [id])
      .with(Definition.dataSignature.makeswiftFile, ({ id }) => [id])
      .otherwise(() => []) as R[]
  }
}

export class ImageDefinition<
  C extends Config = DefaultConfig,
> extends Definition<C> {}

type UserConfig<F extends Config['format']> = Config & {
  format?: F
}

type NormedConfig<F extends Config['format']> = undefined extends F
  ? Config
  : { label?: string | undefined; format: F }

export function Image<F extends Config['format']>(
  config?: UserConfig<F>,
): ImageDefinition<NormedConfig<F>> {
  return new ImageDefinition((config ?? {}) as NormedConfig<F>, 1)
}

Image.Format = Definition.Format

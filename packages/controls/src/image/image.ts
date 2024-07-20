import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { type CopyContext } from '../context'
import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'

import {
  DefaultControlInstance,
  ControlInstance,
  type SendMessage,
} from '../control-instance'

import { type Effector } from '../effector'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
} from '../control-definition'

import { IntrospectionTarget, IntrospectionTargetType } from '../introspect'

const resolvedImageUrlSchema = z.string().optional()

const resolvedImageWithDimensionsSchema = z
  .object({
    url: z.string(),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
    }),
  })
  .optional()

const v0DataSchema = z.string()

const makeswiftFileDataSchema = z.object({
  type: z.literal('makeswift-file'),
  version: z.literal(1),
  id: z.string(),
})

const externalFileDataSchema = z.object({
  type: z.literal('external-file'),
  version: z.literal(1),
  url: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
})

const v1DataSchema = z.union([makeswiftFileDataSchema, externalFileDataSchema])

export const ImageControlValueFormat = {
  URL: 'makeswift::controls::image::format::url',
  WithDimensions: 'makeswift::controls::image::format::with-dimensions',
} as const

type ImageControlValueFormat =
  (typeof ImageControlValueFormat)[keyof typeof ImageControlValueFormat]

type Config =
  | z.infer<typeof Definition.schema.url.config>
  | z.infer<typeof Definition.schema.withDimensions.config>

type SchemaType<C extends Config> = undefined extends C['format']
  ? typeof Definition.schema.url
  : C['format'] extends typeof ImageControlValueFormat.WithDimensions
    ? typeof Definition.schema.withDimensions
    : C['format'] extends typeof ImageControlValueFormat.URL
      ? typeof Definition.schema.url
      : never

type DataType<C extends Config> = z.infer<SchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<SchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  SchemaType<C>['resolvedValue']
>

type InstanceType<_C extends Config> = ControlInstance<any>

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::image' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()

    const data = z.union([v0DataSchema, v1DataSchema])

    const value = data

    const config = z.object({
      label: z.string().optional(),
      format: z
        .union([
          z.literal(ImageControlValueFormat.URL),
          z.literal(ImageControlValueFormat.WithDimensions),
        ])
        .optional(),
    })

    const definition = z.object({
      type,
      config,
      version,
    })

    const schemas = <R>(resolvedValue: z.ZodType<R>) => ({
      type,
      data,
      value,
      resolvedValue,
      config,
      version,
      definition,
    })

    return {
      type,
      version,
      withDimensions: schemas(resolvedImageWithDimensionsSchema),
      url: schemas(resolvedImageUrlSchema),
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type)
      throw new Error(
        `Image deserialization: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.url.definition.parse(data)
    return new Definition(config, version)
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

  get schema() {
    return match(this.config.format)
      .with(ImageControlValueFormat.URL, () => Definition.schema.url)
      .with(
        ImageControlValueFormat.WithDimensions,
        () => Definition.schema.withDimensions,
      )
      .with(undefined, () => Definition.schema.url)
      .exhaustive()
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    //TODO: @arvin Review
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType<C>): DataType<C> {
    const version = this.version
    return match({ version, value })
      .with({ version: 1, value: P.string }, ({ version, value }) => ({
        type: 'makeswift-file' as const,
        id: value,
        version,
      }))
      .otherwise(() => value)
  }

  copyData(
    data: DataType<C> | undefined,
    { replacementContext }: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const replaceFileId = (fileId: string) =>
      replacementContext.fileIds.get(fileId) ?? fileId

    const inputSchema = this.schema.data.optional()

    return match(data satisfies z.infer<typeof inputSchema>)
      .with(P.string, (id) => replaceFileId(id))
      .with({ type: 'makeswift-file' }, (data) => ({
        ...data,
        id: replaceFileId(data.id),
      }))
      .otherwise((val) => val)
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    const format = this.config.format
    const dataSchema = this.schema.data.optional()
    const resolvedValueSchema = this.schema.resolvedValue

    function toResolvedValue(
      previous: ResolvedValueType<C>,
      curr: {
        url: string
        width?: number | null
        height?: number | null
      },
    ): ResolvedValueType<C> {
      if (format === ImageControlValueFormat.URL || format == null) {
        return curr.url
      }

      return match([
        previous satisfies z.infer<typeof resolvedValueSchema>,
        curr,
      ])
        .with(
          [
            {
              url: P.string,
              dimensions: { width: P.number, height: P.number },
            },
            { url: P.string, width: P.number, height: P.number },
          ],
          ([prev, curr]) => {
            if (
              prev.url === curr.url &&
              prev.dimensions.width === curr.width &&
              prev.dimensions.height === curr.height
            ) {
              return prev
            }
            return {
              url: curr.url,
              dimensions: { width: curr.width, height: curr.height },
            }
          },
        )
        .with(
          [
            P.union(P.string, undefined),
            { url: P.string, width: P.number, height: P.number },
          ],
          ([_, curr]) => {
            return {
              url: curr.url,
              dimensions: { width: curr.width, height: curr.height },
            }
          },
        )
        .otherwise(() => undefined)
    }

    const externalFile = match(data satisfies z.infer<typeof dataSchema>)
      .with({ type: 'external-file' }, (val) => val)
      .otherwise(() => null)

    if (externalFile != null) {
      return {
        readStableValue: (previous: ResolvedValueType<C>) =>
          toResolvedValue(previous, {
            url: externalFile.url,
            width: externalFile.width,
            height: externalFile.height,
          }),
        subscribe: () => () => {},
      }
    }

    const fileId = match(data satisfies z.infer<typeof dataSchema>)
      .with(P.string, (id) => id)
      .with({ type: 'makeswift-file' }, ({ id }) => id)
      .otherwise(() => undefined)

    const file = resolver.resolveFile(fileId)
    if (fileId != null && file.readStableValue() == null) {
      effector.queueAsyncEffect(() => file.fetch())
    }

    return {
      readStableValue: (previous: ResolvedValueType<C>) => {
        const currentFile = file.readStableValue()
        if (currentFile == null) return undefined
        const currentUrl = currentFile.publicUrl

        return toResolvedValue(previous, {
          url: currentUrl,
          width: currentFile.dimensions?.width,
          height: currentFile.dimensions?.height,
        })
      },
      subscribe: file.subscribe,
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance {
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
    if (target.type !== IntrospectionTargetType.File) return []

    const dataSchema = this.schema.data.optional()
    return match(data satisfies z.infer<typeof dataSchema>)
      .with(P.string, (id) => [id])
      .with({ type: 'makeswift-file' }, ({ id }) => [id])
      .otherwise(() => []) as R[]
  }
}

export const Image = <C extends Config>(config?: C) =>
  new (class Image extends Definition<C> {})(config ?? ({} as C), 1)

export { Definition as ImageDefinition }

Image.Format = ImageControlValueFormat

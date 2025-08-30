import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { isElementReference, Schema, type Data } from '../../common'
import {
  ContextResource,
  shouldRemoveResource,
  type CopyContext,
  type MergeContext,
  type MergeTranslatableDataContext,
} from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import { type SerializedRecord } from '../../serialization'

import { ControlDefinition, serialize, type SchemaType } from '../definition'
import { type SendMessage } from '../instance'

import { SlotControl } from './slot-control'

type Schema = typeof Definition.schema
type DataType = z.infer<Schema['data']>
type ValueType = z.infer<Schema['value']>

type Config = {
  // Default grid column count for the Slot panel UI and runtime fallback
  columnCount?: number
}

abstract class Definition<RuntimeNode> extends ControlDefinition<
  typeof Definition.type,
  Config,
  DataType,
  ValueType,
  RuntimeNode,
  SlotControl
> {
  static readonly type = 'makeswift::controls::slot' as const

  static get schema() {
    const type = z.literal(this.type)
    const columnData = z.object({
      count: z.number(),
      spans: z.array(z.array(z.number())),
    })

    const element = Schema.element.and(
      z.object({ deleted: z.boolean().optional() }),
    )

    const data = z.object({
      elements: z.array(element),
      columns: Schema.responsiveValue(columnData),
    })

    const value = data

    const definition = z.object({
      type,
      config: z
        .object({
          columnCount: z.number().min(1).max(24).default(12).optional(),
        })
        .optional(),
    })

    return {
      type,
      data,
      value,
      definition,
    }
  }

  constructor(config?: Config) {
    super((config ?? {}) as Config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return {
      ...Definition.schema,
      resolvedValue: this.nodeSchema,
    }
  }

  get nodeSchema(): SchemaType<RuntimeNode> {
    return z.any()
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return data
  }

  toData(value: ValueType): DataType {
    return value
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    if (data == null) return data

    return {
      ...data,
      elements: data.elements
        .filter(
          (el) =>
            !(
              isElementReference(el) &&
              shouldRemoveResource(
                ContextResource.GlobalElement,
                el.value,
                context,
              )
            ),
        )
        .map((el) => context.copyElement(el)),
    }
  }

  mergeData(
    base: DataType | undefined = { columns: [], elements: [] },
    override: DataType | undefined = { columns: [], elements: [] },
    context: MergeContext,
  ): DataType {
    const mergedColumns = base.columns
    const mergedElements = base.elements.flatMap((baseElement) => {
      const overrideElement = override.elements.find(
        (e) => baseElement.type === e.type && baseElement.key === e.key,
      )

      if (overrideElement == null) return [baseElement]
      if (overrideElement.deleted) return []
      if (isElementReference(overrideElement)) return [overrideElement]
      if (isElementReference(baseElement)) return [baseElement]

      return context.mergeElement(baseElement, overrideElement)
    })

    return { columns: mergedColumns, elements: mergedElements }
  }

  mergeTranslatedData(
    data: DataType,
    _translatedData: Data,
    context: MergeTranslatableDataContext,
  ): DataType {
    return {
      ...data,
      elements: data.elements.map((element) =>
        context.mergeTranslatedData(element),
      ),
    }
  }

  createInstance(sendMessage: SendMessage) {
    return new SlotControl(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    if (data == null) return []
    if (target.type == Targets.ChildrenElement.type) {
      return data.elements as R[]
    }

    return []
  }
}

export { Definition as SlotDefinition }

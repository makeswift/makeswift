import { z } from 'zod'

import { createResponsiveValueSchema, elementSchema } from '../common'
import { type CopyContext } from '../context'

import { ControlInstance, type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type Schema,
} from '../control-definition'

import { SlotControl } from './slot-control'

type DataType = z.infer<typeof Definition.schema.data>
type ValueType = z.infer<typeof Definition.schema.value>

abstract class Definition<RuntimeNode> extends ControlDefinition<
  typeof Definition.type,
  unknown,
  DataType,
  ValueType,
  RuntimeNode
> {
  static readonly type = 'makeswift::controls::slot' as const

  static get schema() {
    const type = z.literal(this.type)
    const columnData = z.object({
      count: z.number(),
      spans: z.array(z.array(z.number())),
    })

    const element = elementSchema.and(
      z.object({ deleted: z.boolean().optional() }),
    )

    const data = z.object({
      elements: z.array(element),
      columns: createResponsiveValueSchema(columnData),
    })

    const value = data

    const definition = z.object({
      type,
    })

    return {
      type,
      data,
      value,
      definition,
    }
  }

  constructor() {
    super({})
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

  get nodeSchema(): Schema<RuntimeNode> {
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
      elements: data.elements.map((element) => context.copyElement(element)),
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new SlotControl(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export { Definition as SlotDefinition }

// /**
//  * @todo
//  * - Inserting elements
//  * - Moving elements
//  * - Merging column data
//  */
// export function mergeSlotData(
//   base: SlotControlData | undefined = { columns: [], elements: [] },
//   override: SlotControlData | undefined = { columns: [], elements: [] },
//   context: MergeContext,
// ): SlotControlData {
//   const mergedColumns = base.columns
//   const mergedElements = base.elements.flatMap(baseElement => {
//     const overrideElement = override.elements.find(
//       e => baseElement.type === e.type && baseElement.key === e.key,
//     )

//     if (overrideElement == null) return [baseElement]

//     if (overrideElement.deleted) return []

//     if (isElementReference(overrideElement)) return [overrideElement]

//     if (isElementReference(baseElement)) return [baseElement]

//     return context.mergeElement(baseElement, overrideElement)
//   })

//   return { columns: mergedColumns, elements: mergedElements }
// }

// export function mergeSlotControlTranslatedData(
//   data: SlotControlData,
//   context: MergeTranslatableDataContext,
// ) {
//   return {
//     ...data,
//     elements: data.elements.map(element => context.mergeTranslatedData(element)),
//   }
// }

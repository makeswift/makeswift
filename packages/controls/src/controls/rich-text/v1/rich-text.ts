import { Selection } from 'slate'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../../lib/zod'

import { type CopyContext } from '../../../context'
import { type IntrospectionTarget } from '../../../introspection'
import { ControlDefinition, type SchemaType } from '../../definition'
import { ControlInstance } from '../../instance'
import { ControlDefinitionVisitor } from '../../visitor'

import {
  DTOSchema,
  richTextDAOToDTO,
  richTextDTOtoDAO,
  richTextDTOtoSelection,
} from '../dto'
import { Descendant } from '../slate'

import { copyRichTextData } from './copy'
import { introspectRichTextData } from './introspection'

type DataType = z.infer<typeof Definition.schema.data>
type ValueType = z.infer<typeof Definition.schema.value>

abstract class Definition<
  RuntimeNode,
  InstanceType extends ControlInstance<any>,
> extends ControlDefinition<
  typeof Definition.type,
  unknown,
  DataType,
  ValueType,
  RuntimeNode,
  InstanceType
> {
  static readonly type = 'makeswift::controls::rich-text' as const

  static get schema() {
    const type = z.literal(this.type)
    const data = DTOSchema.valueJSON
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
    const baseSchema = Definition.schema
    return {
      ...baseSchema,
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
    return copyRichTextData(data, context)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitRichTextV1(this, ...args)
  }

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    return introspectRichTextData(data, target)
  }

  static nodesToData(children: Descendant[], selection: Selection): DataType {
    return richTextDAOToDTO(children, selection)
  }

  static dataToNodes(data: DataType): Descendant[] {
    return richTextDTOtoDAO(data)
  }

  static dataToSelection(data: DataType): Selection {
    return richTextDTOtoSelection(data)
  }
}

export type RichTextValue = DataType
export { Definition as RichTextV1Definition }

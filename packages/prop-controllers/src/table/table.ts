import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from '../prop-controllers'
import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
} from '@makeswift/controls'
import { P, match } from 'ts-pattern'

const tableIdSchema = z.string()

type TableId = z.infer<typeof tableIdSchema>

const tablePropControllerDataV0Schema = tableIdSchema

export type TablePropControllerDataV0 = z.infer<
  typeof tablePropControllerDataV0Schema
>

export const TablePropControllerDataV1Type = 'prop-controllers::table::v1'

const tablePropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(TablePropControllerDataV1Type),
  value: tableIdSchema,
})

export type TablePropControllerDataV1 = z.infer<
  typeof tablePropControllerDataV1Schema
>

export const tablePropControllerDataSchema = z.union([
  tablePropControllerDataV0Schema,
  tablePropControllerDataV1Schema,
])

export type TablePropControllerData = z.infer<
  typeof tablePropControllerDataSchema
>

export type TableOptions = Options<{
  preset?: TablePropControllerData
}>

type TableDescriptorV0<_T = TablePropControllerDataV0> = {
  type: typeof Types.Table
  options: TableOptions
}

type TableDescriptorV1<
  _T = TablePropControllerData,
  U extends TableOptions = TableOptions,
> = {
  type: typeof Types.Table
  version: 1
  options: U
}

export type TableDescriptor<_T = TablePropControllerData> =
  | TableDescriptorV0
  | TableDescriptorV1

export type ResolveTablePropControllerValue<T extends TableDescriptor> =
  T extends TableDescriptor ? TableId | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Table(options: TableOptions = {}): TableDescriptorV1 {
  return { type: Types.Table, version: 1, options }
}

export function getTablePropControllerDataTableId(
  data: TablePropControllerData | undefined,
): TableId | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: TablePropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createTablePropControllerDataFromTableId(
  value: TableId,
  definition?: TableDescriptor,
): TablePropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: TablePropControllerDataV1Type,
          value,
        }) as const,
    )
    .otherwise(() => value)
}

function copyTableId(data: TableId, context: CopyContext): TableId {
  if (data == null) return data

  return replaceResourceIfNeeded(ContextResource.Table, data, context)
}

export function copyTablePropControllerData(
  data: TablePropControllerData | undefined,
  ctx: CopyContext,
): TablePropControllerData | undefined {
  const currentTableId = getTablePropControllerDataTableId(data)
  if (
    currentTableId != null &&
    shouldRemoveResource(ContextResource.Table, currentTableId, ctx)
  ) {
    return undefined
  }

  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: TablePropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: TablePropControllerDataV1Type,
          value: copyTableId(v1.value, ctx),
        }) as const,
    )
    .otherwise((v0) => copyTableId(v0, ctx))
}

export function getTablePropControllerDataTableIds(
  data: TablePropControllerData | undefined,
): string[] {
  const value = getTablePropControllerDataTableId(data)

  return value ? [value] : []
}

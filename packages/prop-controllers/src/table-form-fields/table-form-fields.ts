import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
} from '@makeswift/controls'

const tableFormFieldSchema = z.object({
  id: z.string(),
  tableColumnId: z.string(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z
    .union([z.string(), z.boolean(), z.array(z.string())])
    .optional(),
  required: z.boolean().optional(),
  hidden: z.boolean().optional(),
  type: z.union([z.literal('select'), z.literal('radio')]).optional(),
  hideLabel: z.boolean().optional(),
  autofill: z.boolean().optional(),
})

export const tableFormFieldsDataSchema = z.object({
  fields: z.array(tableFormFieldSchema),
  grid: Schema.responsiveValue(
    z.object({
      count: z.number(),
      spans: z.array(z.array(z.number())),
    }),
  ),
})

export type TableFormFieldsData = z.infer<typeof tableFormFieldsDataSchema>

const tableFormFieldsPropControllerDataV0Schema = tableFormFieldsDataSchema

export type TableFormFieldsPropControllerDataV0 = z.infer<
  typeof tableFormFieldsPropControllerDataV0Schema
>

export const TableFormFieldsPropControllerDataV1Type =
  'prop-controllers::table-form-fields::v1'

const tableFormFieldsPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(TableFormFieldsPropControllerDataV1Type),
  value: tableFormFieldsDataSchema,
})

export type TableFormFieldsPropControllerDataV1 = z.infer<
  typeof tableFormFieldsPropControllerDataV1Schema
>

export const tableFormFieldsPropControllerDataSchema = z.union([
  tableFormFieldsPropControllerDataV0Schema,
  tableFormFieldsPropControllerDataV1Schema,
])

export type TableFormFieldsPropControllerData = z.infer<
  typeof tableFormFieldsPropControllerDataSchema
>

export type TableFormFieldsOptions = Options<{
  preset?: TableFormFieldsPropControllerData
}>

type TableFormFieldsDescriptorV0<_T = TableFormFieldsPropControllerDataV0> = {
  type: typeof Types.TableFormFields
  options: TableFormFieldsOptions
}

type TableFormFieldsDescriptorV1<
  _T = TableFormFieldsPropControllerData,
  U extends TableFormFieldsOptions = TableFormFieldsOptions,
> = {
  type: typeof Types.TableFormFields
  version: 1
  options: U
}

export type TableFormFieldsDescriptor<_T = TableFormFieldsPropControllerData> =
  | TableFormFieldsDescriptorV0
  | TableFormFieldsDescriptorV1

export type ResolveTableFormFieldsPropControllerValue<
  T extends TableFormFieldsDescriptor,
> = T extends TableFormFieldsDescriptor
  ? TableFormFieldsData | undefined
  : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function TableFormFields(
  options: TableFormFieldsOptions = {},
): TableFormFieldsDescriptorV1 {
  return { type: Types.TableFormFields, version: 1, options }
}

export function getTableFormFieldsPropControllerDataTableFormFieldsData(
  data: TableFormFieldsPropControllerData | undefined,
): TableFormFieldsData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createTableFormFieldsPropControllerDataFromTableFormFieldsData(
  value: TableFormFieldsData,
  definition: TableFormFieldsDescriptor,
): TableFormFieldsPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type,
          value,
        }) as const,
    )
    .otherwise(() => value)
}

function copyTableFormFieldsData(
  data: TableFormFieldsData,
  context: CopyContext,
): TableFormFieldsData {
  if (data == null) return data

  return {
    ...data,
    fields: data.fields
      .filter(
        (field) =>
          !shouldRemoveResource(
            ContextResource.TableColumn,
            field.tableColumnId,
            context,
          ),
      )
      .map((field) => ({
        ...field,
        tableColumnId: replaceResourceIfNeeded(
          ContextResource.TableColumn,
          field.tableColumnId,
          context,
        ),
      })),
  }
}

export function copyTableFormFieldsPropControllerData(
  data: TableFormFieldsPropControllerData | undefined,
  context: CopyContext,
): TableFormFieldsPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type,
          value: copyTableFormFieldsData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyTableFormFieldsData(v0, context))
}

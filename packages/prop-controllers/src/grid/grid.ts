import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Element,
  MergeTranslatableDataContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import {
  isElementReference,
  ContextResource,
  shouldRemoveResource,
} from '@makeswift/controls'

const gridColumnSchema = z.object({
  count: z.number(),
  spans: z.array(z.array(z.number())),
})

const gridDataSchema = z.object({
  elements: z.array(Schema.element),
  columns: Schema.responsiveValue(gridColumnSchema),
})

export type GridData = z.infer<typeof gridDataSchema>

const gridPropControllerDataV0Schema = gridDataSchema

export type GridPropControllerDataV0 = z.infer<
  typeof gridPropControllerDataV0Schema
>

export const GridPropControllerDataV1Type = 'prop-controllers::grid::v1'

const gridPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(GridPropControllerDataV1Type),
  value: gridDataSchema,
})

export type GridPropControllerDataV1 = z.infer<
  typeof gridPropControllerDataV1Schema
>

export const gridPropControllerDataSchema = z.union([
  gridPropControllerDataV0Schema,
  gridPropControllerDataV1Schema,
])

export type GridPropControllerData = z.infer<
  typeof gridPropControllerDataSchema
>

export type GridOptions = Options<Record<string, never>>

type GridDescriptorV0<_T = GridPropControllerDataV0> = {
  type: typeof Types.Grid
  options: GridOptions
}

type GridDescriptorV1<
  _T = GridPropControllerData,
  U extends GridOptions = GridOptions,
> = {
  type: typeof Types.Grid
  version: 1
  options: U
}

export type GridDescriptor<_T = GridPropControllerData> =
  | GridDescriptorV0
  | GridDescriptorV1

export type ResolveGridPropControllerValue<T extends GridDescriptor> =
  T extends GridDescriptor ? GridData | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Grid(options: GridOptions = {}): GridDescriptorV1 {
  return { type: Types.Grid, version: 1, options }
}

export function getGridPropControllerDataGridData(
  data: GridPropControllerData | undefined,
): GridData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: GridPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createGridPropControllerDataFromGridData(
  value: GridData,
  definition: GridDescriptor,
): GridPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: GridPropControllerDataV1Type,
          value,
        }) as const,
    )
    .otherwise(() => value)
}

function mergeGridDataTranslatedData(
  data: GridData,
  context: MergeTranslatableDataContext,
): GridData {
  return {
    ...data,
    elements: data.elements.map((element) =>
      context.mergeTranslatedData(element),
    ),
  }
}

export function mergeGridPropControllerTranslatedData(
  data: GridPropControllerData,
  context: MergeTranslatableDataContext,
): GridPropControllerData {
  return match(data)
    .with(
      { [ControlDataTypeKey]: GridPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: GridPropControllerDataV1Type,
          value: mergeGridDataTranslatedData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => mergeGridDataTranslatedData(v0, context))
}

export function getGridPropControllerElementChildren(
  data: GridPropControllerData | undefined,
): Element[] {
  return getGridPropControllerDataGridData(data)?.elements ?? []
}

function copyGridData(data: GridData, context: CopyContext): GridData {
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

export function copyGridPropControllerData(
  data: GridPropControllerData | undefined,
  context: CopyContext,
): GridPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: GridPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: GridPropControllerDataV1Type,
          value: copyGridData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyGridData(v0, context))
}

type Path = ReadonlyArray<string | number>

export function getGridPropControllerGetElementPath(
  data: GridPropControllerData | undefined,
  elementKey: string,
): Path | null {
  const value = getGridPropControllerDataGridData(data)

  const idx =
    value?.elements.findIndex((element) => element.key === elementKey) ?? -1

  if (idx === -1) return null

  return match(data)
    .with({ [ControlDataTypeKey]: GridPropControllerDataV1Type }, (_v1) => [
      'value',
      'elements',
      idx,
    ])
    .otherwise((_v0) => ['elements', idx])
}

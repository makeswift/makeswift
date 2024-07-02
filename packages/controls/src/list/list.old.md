// import {
//   NumberControlDefinition,
//   TextInputControlDefinition,
//   TextAreaControlDefinition,
//   Data,
//   ComboboxControlData,
//   ComboboxControlDefinition,
//   IconRadioGroupControlData,
//   IconRadioGroupControlDefinition,
//   ImageControlData,
//   ImageControlDefinition,
//   LinkControlData,
//   LinkControlDefinition,
// } from '@makeswift/controls'

// import {
//   AnyPropController,
//   createPropController,
//   PropControllerMessage,
//   Send,
// } from '../../../runtime/src/prop-controllers/instances'

// import { PropController } from '../../../runtime/src/prop-controllers/base'
// import {
//   CopyContext,
//   MergeTranslatableDataContext,
// } from '../../../runtime/src/state/react-page'

// import {
//   ControlDefinition,
//   ControlDefinitionData,
//   getTranslatableData,
//   mergeTranslatedData,
// } from '../../../runtime/src/controls/control'

// import { copy as controlCopy } from '../../../runtime/src/controls/control'
// import {
//   getElementChildren,
//   getFileIds,
//   getPageIds,
//   getSwatchIds,
//   getTypographyIds,
// } from '../../../runtime/src/prop-controllers/introspection'
// import {
//   SelectControlData,
//   SelectControlDefinition,
// } from '../../../runtime/src/controls/select'
// import { ShapeControlDefinition } from '../../../runtime/src/controls/shape'
// import {
//   RichTextControlData,
//   RichTextControlDefinition,
// } from '../../../runtime/src/controls/rich-text'
// import {
//   RichTextV2ControlData,
//   RichTextV2ControlDefinition,
// } from '../../../runtime/src/controls/rich-text-v2'
// import {
//   StyleControlData,
//   StyleControlDefinition,
// } from '../../../runtime/src/controls/style'
// import {
//   StyleV2ControlData,
//   StyleV2ControlDefinition,
// } from '../../../runtime/src/controls/style-v2'
// import {
//   TypographyControlData,
//   TypographyControlDefinition,
// } from '../../../runtime/src/controls/typography'
// import { IndexSignatureHack } from '../../../runtime/src/utils/index-signature-hack'

// export type GetItemLabelControlData<T extends ControlDefinition> =
//   T extends NumberControlDefinition
//     ? number
//     : T extends TextInputControlDefinition
//       ? string
//       : T extends TextAreaControlDefinition
//         ? string
//         : T extends SelectControlDefinition
//           ? SelectControlData<T>
//           : T extends IconRadioGroupControlDefinition
//             ? IconRadioGroupControlData<T>
//             : T extends ImageControlDefinition
//               ? ImageControlData
//               : T extends ComboboxControlDefinition
//                 ? ComboboxControlData<T>
//                 : T extends ShapeControlDefinition
//                   ? GetItemLabelShapeControlData<T>
//                   : T extends ListControlDefinition
//                     ? GetItemListControlData<T>
//                     : T extends LinkControlDefinition
//                       ? LinkControlData
//                       : T extends RichTextControlDefinition
//                         ? IndexSignatureHack<RichTextControlData>
//                         : T extends RichTextV2ControlDefinition
//                           ? RichTextV2ControlData
//                           : T extends StyleControlDefinition
//                             ? StyleControlData
//                             : T extends StyleV2ControlDefinition
//                               ? StyleV2ControlData
//                               : T extends TypographyControlDefinition
//                                 ? TypographyControlData
//                                 : never

// export type GetItemLabelListControlItemData<T extends ListControlDefinition> = {
//   id: string
//   type?: T['config']['type']['type']
//   value: GetItemLabelControlData<T['config']['type']>
// }

// export type GetItemLabelShapeControlData<
//   T extends ShapeControlDefinition = ShapeControlDefinition,
// > = {
//   [K in keyof T['config']['type']]?: GetItemLabelControlData<
//     T['config']['type'][K]
//   >
// }

// export type GetItemListControlData<
//   T extends ListControlDefinition = ListControlDefinition,
// > = GetItemLabelListControlItemData<T>[]

// type ListControlConfig<T extends ControlDefinition = ControlDefinition> = {
//   type: T
//   label?: string
//   getItemLabel?(item: GetItemLabelControlData<T> | undefined): string
// }

// export type ListControlDefinition<
//   C extends ListControlConfig = ListControlConfig,
// > = {
//   type: typeof ListControlType
//   config: C
// }

import { match } from 'ts-pattern'
import { z } from 'zod'

import {
  ControlDataTypeKey,
  colorDataSchema,
  type ColorData,
  type CopyContext,
  type ValueType,
  Swatch,
  ControlDataType,
} from '../common'

import { controlTraitsRegistry } from '../registry'
import {
  type ResourceResolver,
  type ResolvableValue,
} from '../resource-resolver'

import {
  type VersionedControlDefinition,
  type ControlTraits,
  type ParseResult,
} from '../traits'

import { DefaultControlInstance, type Send } from '../control-instance'
import { WithAssociatedTypes } from '../utils/associated-types'

export const List = controlTraitsRegistry.add(
  (() => {
    const type = 'makeswift::controls::list' as const
    // const v1DataType = 'list::v1' as const
    // const version = 1 as const

    // const dataSignature = {
    //   v1: { [ControlDataTypeKey]: v1DataType },
    // } as const

    // const dataSchema = z.union([
    //   colorDataSchema,
    //   colorDataSchema.and(
    //     z.object({
    //       [ControlDataTypeKey]: z.literal(v1DataType),
    //     }),
    //   ),
    // ])

    // type ControlData = z.infer<typeof dataSchema>

    type ItemData<ItemDef extends ControlDefinition> = {
      id: string
      type?: ItemDef['type']
      value: ControlDataType<ItemDef>
    }

    // export type ListControlData<
    //   T extends ListControlDefinition = ListControlDefinition,
    // > = ListControlItemData<T>[]

    type Config<
      Def extends VersionedControlDefinition = VersionedControlDefinition,
    > = {
      type: Def
      label?: string
      getItemLabel?(item: ControlDataType<Def> | undefined): string
    }

    type ControlDefinition<C extends Config = Config> = {
      type: typeof type
      config: C
    } & WithAssociatedTypes<{
      ControlType: typeof type
      Config: Config
      ValueType: ValueType
      ResolvedValueType: ResolvedValueType
    }>
    //   typeof type,
    //   C,
    //   ColorData,
    //   typeof version,
    //   undefined extends C['defaultValue'] ? string | undefined : string
    // >

    // export type ListControlDefinition<
    //   C extends ListControlConfig = ListControlConfig,
    // > = {
    //   type: typeof ListControlType
    //   config: C
    // }

    const ctor = <C extends Config>(config?: C): ControlDefinition<C> => ({
      type,
      config: config ?? ({} as C),
      version,
    })

    ctor.controlType = type
    ctor.dataSignature = dataSignature

    ctor.safeParse = (
      data: unknown | undefined,
    ): ParseResult<ControlData | undefined> => {
      const result = dataSchema.optional().safeParse(data)
      return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.flatten().formErrors[0] }
    }

    ctor.fromData = (
      data: ControlData | undefined,
      _definition: ControlDefinition,
    ) => {
      return match(data)
        .with(dataSignature.v1, ({ swatchId, alpha }) => ({ swatchId, alpha }))
        .otherwise((value) => value ?? null)
    }

    ctor.toData = (
      value: ColorData,
      definition: ControlDefinition,
    ): ControlData => {
      return match('version' in definition ? definition.version : undefined)
        .with(version, () => ({
          ...dataSignature.v1,
          ...value,
        }))
        .with(undefined, () => value)
        .exhaustive()
    }

    ctor.copyData = (
      data: ControlData | undefined,
      { replacementContext }: CopyContext,
    ): ControlData | undefined => {
      if (data == null) return data

      const replaceSwatchId = (swatchId: string) =>
        replacementContext.swatchIds.get(swatchId) ?? swatchId

      return match(data)
        .with(dataSignature.v1, (val) => ({
          ...val,
          swatchId: replaceSwatchId(val.swatchId),
        }))
        .otherwise((val) => ({
          ...val,
          swatchId: replaceSwatchId(val.swatchId),
        }))
    }

    ctor.getSwatchIds = (data: ControlData | undefined): string[] =>
      data?.swatchId == null ? [] : [data.swatchId]

    ctor.resolveValue = (
      value: ValueType<ControlDefinition>,
      definition: ControlDefinition,
      resolver: ResourceResolver,
    ): ResolvableValue<string | undefined> => {
      const { swatchId, alpha } = value ?? {}
      return resolver
        .resolveSwatch(swatchId)
        .map((swatch) =>
          swatchToColorString(swatch, alpha, definition.config.defaultValue),
        )
    }

    ctor.createInstance = (send: Send) => new DefaultControlInstance(send)

    return ctor as typeof ctor &
      ControlTraits<typeof type, ControlData, ControlDefinition>
  })(),
)

// export function List<
//   T extends ControlDefinition,
//   C extends ListControlConfig<T>,
// >(config: C & { type: T }): ListControlDefinition<C> {
//   return { type: ListControlType, config }
// }

// export const ListControlMessageType = {
//   LIST_CONTROL_ITEM_CONTROL_MESSAGE:
//     'makeswift::controls::list::message::item-control-message',
// } as const

// type ListControlItemControlMessage = {
//   type: typeof ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE
//   payload: { message: PropControllerMessage; itemId: string }
// }

// export type ListControlMessage = ListControlItemControlMessage

// export class ListControl<
//   T extends ListControlDefinition = ListControlDefinition,
// > extends PropController<ListControlMessage> {
//   controls: Map<string, AnyPropController>
//   descriptor: ListControlDefinition
//   send: Send<ListControlMessage>

//   constructor(send: Send<ListControlMessage>, descriptor: T) {
//     super(send)

//     this.descriptor = descriptor
//     this.send = send

//     this.controls = new Map<string, AnyPropController>()
//   }

//   setItemsControl = (value: ListControlData<T> | undefined) => {
//     const controls = new Map<string, AnyPropController>()

//     if (value == null) return

//     const shouldUpdate = () => {
//       // If the length is different, should update
//       if (value.length !== this.controls.size) return true
//       // If this.controls does not have an itemId, should update
//       if (!value.every(({ id }) => this.controls.has(id))) return true

//       return false
//     }

//     if (!shouldUpdate()) return this.controls

//     value.forEach((item) => {
//       const control = createPropController(
//         this.descriptor.config.type,
//         (message) =>
//           this.send({
//             type: ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE,
//             payload: { message, itemId: item.id },
//           }),
//       )

//       controls.set(item.id, control)
//     })

//     this.controls = controls

//     return this.controls
//   }

//   recv = (message: ListControlMessage) => {
//     switch (message.type) {
//       case ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE: {
//         const control = this.controls.get(message.payload.itemId)

//         if (control == null) return

//         // TODO: We're casting the type here as the arg0 type for control.recv is never
//         const recv = control.recv as (arg0: PropControllerMessage) => void

//         recv(message.payload.message)
//       }
//     }
//   }
// }

// export function copyListData(
//   definition: ListControlDefinition,
//   value: ListControlData | undefined,
//   context: CopyContext,
// ): ListControlData | undefined {
//   if (value == null) return value

//   return (
//     value &&
//     value.map((item) => ({
//       ...item,
//       value: controlCopy(definition.config.type, item.value, context),
//     }))
//   )
// }

// function introspectListData<T>(
//   definition: ListControlDefinition,
//   value: ListControlData | undefined,
//   func: (definition: ControlDefinition, data: Data) => T[],
// ): T[] {
//   if (value == null) return []

//   return value.flatMap((item) => func(definition.config.type, item.value))
// }

// export function getListElementChildren(
//   definition: ListControlDefinition,
//   value: ListControlData,
// ) {
//   return introspectListData(definition, value, getElementChildren)
// }

// export function getListSwatchIds(
//   definition: ListControlDefinition,
//   value: ListControlData,
// ) {
//   return introspectListData(definition, value, getSwatchIds)
// }

// export function getListFileIds(
//   definition: ListControlDefinition,
//   value: ListControlData,
// ) {
//   return introspectListData(definition, value, getFileIds)
// }

// export function getListTypographyIds(
//   definition: ListControlDefinition,
//   value: ListControlData,
// ) {
//   return introspectListData(definition, value, getTypographyIds)
// }

// export function getListPageIds(
//   definition: ListControlDefinition,
//   value: ListControlData,
// ) {
//   return introspectListData(definition, value, getPageIds)
// }

// export function getListTranslatableData(
//   definition: ListControlDefinition,
//   data: ListControlData,
// ) {
//   return Object.fromEntries(
//     data.map((item) => [
//       item.id,
//       getTranslatableData(definition.config.type, item.value),
//     ]),
//   )
// }

// export type ListControlTranslationDto = Record<string, ListControlData>

// export function mergeListTranslatedData(
//   definition: ListControlDefinition,
//   data: ListControlData,
//   translatedData: ListControlTranslationDto,
//   context: MergeTranslatableDataContext,
// ) {
//   return data.map((item) => {
//     return {
//       ...item,
//       value: mergeTranslatedData(
//         definition.config.type,
//         item.value,
//         translatedData[item.id],
//         context,
//       ),
//     }
//   })
// }

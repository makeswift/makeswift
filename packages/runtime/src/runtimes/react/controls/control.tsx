import { ControlDefinition, type DataType, type ResolvedValueType } from '@makeswift/controls'

import { AnyPropController } from '../../../prop-controllers/instances'
// import { RenderHook } from '../components'
// import { RichTextControlValue, useRichText } from './rich-text/rich-text'
// import { RichTextV2ControlValue, useRichTextV2 } from './rich-text-v2'
// import { StyleV2ControlFormattedValue, StyleV2ControlValue } from './style-v2'
// import { TypographyControlValue, useTypographyValue } from './typography'
import { isLegacyDescriptor } from '../../../prop-controllers/descriptors'

type ControlValueProps<Def extends ControlDefinition> = {
  definition: Def
  data: DataType<Def> | undefined
  children(value: ResolvedValueType<Def>): JSX.Element
  control?: AnyPropController
}

export function ControlValue<Def extends ControlDefinition>({
  data,
  definition,
  children,
  // control,
}: ControlValueProps<Def>): JSX.Element {
  if (!isLegacyDescriptor(definition)) {
    return children(data as ResolvedValueType<Def>)
  }

  switch (definition.type) {
    // case NumberControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useNumber}
    //       parameters={[data as NumberControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case TextInputControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useTextInputValue}
    //       parameters={[data as TextInputControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case TextAreaControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useTextAreaValue}
    //       parameters={[data as TextAreaControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case SelectControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useSelectControlValue}
    //       parameters={[data as SelectControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case IconRadioGroupControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useIconRadioGroupValue}
    //       parameters={[data as IconRadioGroupControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case ImageControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useImageControlValue}
    //       parameters={[data as ImageControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case LinkControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useLinkControlValue}
    //       parameters={[data as LinkControlData, definition]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case ComboboxControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useComboboxControlValue}
    //       parameters={[data as ComboboxControlData]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case ShapeControlType:
    //   return (
    //     <ShapeControlValue
    //       definition={definition}
    //       data={data as ShapeControlData}
    //       control={control as ShapeControl}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </ShapeControlValue>
    //   )

    // case StyleV2Definition.type:
    //   return (
    //     <StyleV2ControlValue
    //       key={definition.type}
    //       data={data as StyleV2ControlData}
    //       definition={definition}
    //       control={control as StyleV2Control}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </StyleV2ControlValue>
    //   )

    // case SlotControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useSlot}
    //       parameters={[data as unknown as SlotControlData, control as SlotControl]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case RichTextControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useRichText}
    //       parameters={[data as unknown as RichTextControlData, control as RichTextControl]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case RichTextV2ControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useRichTextV2}
    //       parameters={[
    //         data as unknown as RichTextV2ControlData,
    //         definition,
    //         control as RichTextV2Control,
    //       ]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case StyleControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useFormattedStyle}
    //       parameters={[data as unknown as StyleControlData, definition, control as StyleControl]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    // case TypographyControlType:
    //   return (
    //     <RenderHook
    //       key={definition.type}
    //       hook={useTypographyValue}
    //       parameters={[data as unknown as TypographyControlData[number]]}
    //     >
    //       {value => children(value as ControlDefinitionValue<T>)}
    //     </RenderHook>
    //   )

    default:
      return children(data as ResolvedValueType<Def>)
  }
}

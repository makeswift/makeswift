import {
  ControlDefinition,
  type DataType,
  type ResolvedValueType,
  type InstanceType,
} from '@makeswift/controls'

import {
  CheckboxDefinition,
  NumberDefinition,
  RichTextV2Definition,
  ColorDefinition,
  ComboboxDefinition,
  IconRadioGroupDefinition,
  ImageDefinition,
  LinkDefinition,
  ListDefinition,
  RichTextV1Definition,
  SelectDefinition,
  ShapeDefinition,
  SlotDefinition,
  StyleDefinition,
  StyleV2Definition,
  TextAreaDefinition,
  TextInputDefinition,
  unstable_TypographyDefinition,
} from '../../../controls'

import { RenderHook } from '../components'
import { useCheckboxControlValue } from './checkbox'
import { useColorValue } from './color'
import { useComboboxControlValue } from './combobox'
import { useIconRadioGroupValue } from './icon-radio-group'
import { useImageControlValue } from './image'
import { useLinkControlValue } from './link'
import { ListControlValue } from './list'
import { useNumber } from './number'
import { useRichText } from './rich-text/rich-text'
import { useRichTextV2 } from './rich-text-v2'
import { useSelectControlValue } from './select'
import { ShapeControlValue } from './shape'
import { useSlot } from './slot'
import { useFormattedStyle } from './style'
import { StyleV2ControlValue } from './style-v2'
import { useTextAreaValue } from './text-area'
import { useTextInputValue } from './text-input'
import { useTypographyValue } from './typography'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): JSX.Element
  control?: InstanceType<ControlDefinition>
}

export function ControlValue({
  data,
  definition,
  children,
  control,
}: ControlValueProps): JSX.Element {
  switch (definition.controlType) {
    case CheckboxDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useCheckboxControlValue}
          parameters={[data as DataType<CheckboxDefinition>, definition as CheckboxDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case NumberDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useNumber}
          parameters={[data as DataType<NumberDefinition>, definition as NumberDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case TextInputDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useTextInputValue}
          parameters={[data as DataType<TextInputDefinition>, definition as TextInputDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case TextAreaDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useTextAreaValue}
          parameters={[data as DataType<TextAreaDefinition>, definition as TextAreaDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case SelectDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useSelectControlValue}
          parameters={[data as DataType<SelectDefinition>, definition as SelectDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case ColorDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useColorValue}
          parameters={[data as DataType<ColorDefinition>, definition as ColorDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case IconRadioGroupDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useIconRadioGroupValue}
          parameters={[
            data as DataType<IconRadioGroupDefinition>,
            definition as IconRadioGroupDefinition,
          ]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case ImageDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useImageControlValue}
          parameters={[data as DataType<ImageDefinition>, definition as ImageDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case LinkDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useLinkControlValue}
          parameters={[data as DataType<LinkDefinition>, definition as LinkDefinition]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case ComboboxDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useComboboxControlValue}
          parameters={[data as DataType<ComboboxDefinition>]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case ShapeDefinition.type:
      return (
        <ShapeControlValue
          definition={definition as ShapeDefinition}
          data={data as DataType<ShapeDefinition>}
          control={control as InstanceType<ShapeDefinition>}
        >
          {value => children(value)}
        </ShapeControlValue>
      )

    case ListDefinition.type:
      return (
        <ListControlValue
          definition={definition as ListDefinition}
          data={data as DataType<ListDefinition>}
          control={control as InstanceType<ListDefinition>}
        >
          {value => children(value)}
        </ListControlValue>
      )

    case StyleV2Definition.type:
      return (
        <StyleV2ControlValue
          key={definition.controlType}
          data={data as DataType<StyleV2Definition>}
          definition={definition as StyleV2Definition}
          control={control as InstanceType<StyleV2Definition>}
        >
          {value => children(value)}
        </StyleV2ControlValue>
      )

    case SlotDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useSlot}
          parameters={[data as DataType<SlotDefinition>, control as InstanceType<SlotDefinition>]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case RichTextV1Definition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useRichText}
          parameters={[
            data as DataType<RichTextV1Definition>,
            control as InstanceType<RichTextV1Definition>,
          ]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case RichTextV2Definition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useRichTextV2}
          parameters={[
            data as DataType<RichTextV2Definition>,
            definition as RichTextV2Definition,
            control as InstanceType<RichTextV2Definition>,
          ]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case StyleDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useFormattedStyle}
          parameters={[
            data as DataType<StyleDefinition>,
            definition as StyleDefinition,
            control as InstanceType<StyleDefinition>,
          ]}
        >
          {value => children(value)}
        </RenderHook>
      )

    case unstable_TypographyDefinition.type:
      return (
        <RenderHook
          key={definition.controlType}
          hook={useTypographyValue}
          parameters={[data as DataType<unstable_TypographyDefinition>]}
        >
          {value => children(value)}
        </RenderHook>
      )

    default:
      return children(data)
  }
}

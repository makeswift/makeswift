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
  FontDefinition,
  GroupDefinition,
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

import { FallbackComponent } from '../../../components/shared/FallbackComponent'

import { RenderHook } from '../components'
import { useColorValue } from './color'
import { useImageControlValue } from './image'
import { useLinkControlValue } from './link'
import { ListControlValue } from './list'
import { useRichText } from './rich-text/rich-text'
import { useRichTextV2 } from './rich-text-v2'
import { ShapeControlValue } from './shape'
import { useSlot } from './slot'
import { useFormattedStyle } from './style'
import { StyleV2ControlValue } from './style-v2'
import { useTypographyValue } from './typography'
import { GroupControlValue } from './group'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): JSX.Element
  control?: InstanceType<ControlDefinition>
}

type Result<T> = { success: true; value: T } | { success: false; error: string }

export function resolveValue(
  data: DataType<ControlDefinition> | undefined,
  definition: ControlDefinition,
): Result<ResolvedValueType<ControlDefinition>> {
  try {
    return { success: true, value: definition.resolveValue(data).readStableValue() }
  } catch (error) {
    console.error(`Error resolving '${definition.controlType}' prop value`, { error, data })
    return { success: false, error: `${error}` }
  }
}

export function ControlValue({
  data,
  definition,
  children,
  control,
}: ControlValueProps): JSX.Element {
  switch (definition.controlType) {
    case CheckboxDefinition.type:
    case NumberDefinition.type:
    case TextInputDefinition.type:
    case TextAreaDefinition.type:
    case SelectDefinition.type:
    case IconRadioGroupDefinition.type:
    case ComboboxDefinition.type:
    case FontDefinition.type:
      const resolved = resolveValue(data, definition)
      return resolved.success ? (
        <RenderHook key={definition.controlType} hook={() => resolved.value} parameters={[]}>
          {value => children(value)}
        </RenderHook>
      ) : (
        <FallbackComponent text="Incompatible component version" />
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

    case GroupDefinition.type:
      return (
        <GroupControlValue
          definition={definition as GroupDefinition}
          data={data as DataType<GroupDefinition>}
          control={control as InstanceType<GroupDefinition>}
        >
          {value => children(value)}
        </GroupControlValue>
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

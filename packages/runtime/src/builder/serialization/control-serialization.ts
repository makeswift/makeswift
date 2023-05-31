import {
  ComboboxControlType,
  ListControlDefinition,
  ListControlType,
  RichTextV2ControlDefinition,
  RichTextV2ControlType,
  ShapeControlDefinition,
  ShapeControlType,
  StyleV2ControlDefinition,
  StyleV2ControlType,
} from '../../controls'
import {
  CheckboxDescriptor as CheckboxControl,
  Data,
  DateDescriptor as DateControl,
  GapXDescriptor as GapXControl,
  GapYDescriptor as GapYControl,
  ImageDescriptor as ImageControl,
  LinkDescriptor as LinkControl,
  ListDescriptor as ListControl,
  ListValue as ListControlValue,
  NumberDescriptor as NumberControl,
  ResponsiveColorDescriptor as ResponsiveColorControl,
  ResponsiveNumberDescriptor as ResponsiveNumberControl,
  ResponsiveIconRadioGroupDescriptor as ResponsiveIconRadioGroupControl,
  ResponsiveSelectDescriptor as ResponsiveSelectControl,
  ResponsiveLengthDescriptor as ResponsiveLengthControl,
  RichTextDescriptor as RichTextControl,
  ShapeDescriptor as ShapeControl,
  TextInputDescriptor as TextInputControl,
  TextStyleDescriptor as TextStyleControl,
  TypeaheadDescriptor as TypeaheadControl,
  TypeaheadValue as TypeaheadControlValue,
  PanelDescriptor as PanelControl,
  PanelDescriptorValueType as PanelControlValueType,
  PropControllerDescriptor as Control,
  Props as Controls,
} from '../../prop-controllers'
import {
  deserializeComboboxControlDefinition,
  serializeComboboxControlDefinition,
} from './controls/combobox'
import { Deserialize, Serialize } from './controls/types'
import {
  deserializeFunction,
  isSerializedFunction,
  serializeFunction,
} from './function-serialization'
import {
  DeserializedCheckboxControl,
  DeserializedControl,
  DeserializedDateControl,
  DeserializedGapXControl,
  DeserializedGapYControl,
  DeserializedImageControl,
  DeserializedLinkControl,
  DeserializedListControl,
  DeserializedNumberControl,
  DeserializedPanelControl,
  DeserializedResponsiveColorControl,
  DeserializedResponsiveIconRadioGroupControl,
  DeserializedResponsiveLengthControl,
  DeserializedResponsiveNumberControl,
  DeserializedResponsiveSelectControl,
  DeserializedRichTextControl,
  DeserializedShapeControl,
  DeserializedTextInputControl,
  DeserializedTextStyleControl,
  DeserializedTypeaheadControl,
  SerializedCheckboxControl,
  SerializedControl,
  SerializedDateControl,
  SerializedGapXControl,
  SerializedGapYControl,
  SerializedImageControl,
  SerializedLinkControl,
  SerializedListControl,
  SerializedNumberControl,
  SerializedPanelControl,
  SerializedPanelControlValueType,
  SerializedResponsiveColorControl,
  SerializedResponsiveIconRadioGroupControl,
  SerializedResponsiveLengthControl,
  SerializedResponsiveNumberControl,
  SerializedResponsiveSelectControl,
  SerializedRichTextControl,
  SerializedShapeControl,
  SerializedTextInputControl,
  SerializedTextStyleControl,
  SerializedTypeaheadControl,
} from './types'

function serializeShapeControlDefinition(
  definition: ShapeControlDefinition,
): [Serialize<ShapeControlDefinition>, Transferable[]] {
  const [type, transferables] = Object.entries(definition.config.type).reduce(
    ([type, transferables], [key, value]) => {
      const [serializedType, serializedTransferables] = serializeControl(value)

      type[key] = serializedType
      transferables.push(...serializedTransferables)

      return [type, transferables]
    },
    [{} as Record<string, SerializedControl>, [] as Transferable[]],
  )

  return [{ ...definition, config: { ...definition.config, type } }, transferables] as [
    Serialize<ShapeControlDefinition>,
    Transferable[],
  ]
}

function deserializeShapeControlDefinition(
  definition: Serialize<ShapeControlDefinition>,
): Deserialize<Serialize<ShapeControlDefinition>> {
  const type = Object.entries(definition.config.type).reduce((type, [key, value]) => {
    const serializedType = deserializeControl(value)

    type[key] = serializedType

    return type
  }, {} as Record<string, DeserializedControl>)

  return {
    ...definition,
    config: { ...definition.config, type },
  } as Deserialize<Serialize<ShapeControlDefinition>>
}

function serializeShapeControl<
  T extends Record<string, Data>,
  U extends Record<string, PanelControl>,
>(
  control: ShapeControl<T, U>,
): [
  SerializedShapeControl<
    T,
    { [K in keyof U]: SerializedPanelControl<PanelControlValueType<U[K]>> }
  >,
  Transferable[],
] {
  const { type } = control.options
  const transferables: Transferable[] = []
  const serializedType = {} as {
    [K in keyof U]: SerializedPanelControl<PanelControlValueType<U[K]>>
  }

  Object.entries(type).forEach(([key, control]) => {
    const [serializedControl, serializedControlTransferables] = serializeControl(control)

    serializedType[key as keyof typeof type] = serializedControl as SerializedPanelControl
    transferables.push(...serializedControlTransferables)
  })

  // @ts-expect-error: preset types are incompatible
  return [{ ...control, options: { ...control.options, type: serializedType } }, transferables]
}

function deserializeShapeControl<
  T extends Record<string, Data>,
  U extends Record<string, SerializedPanelControl>,
>(
  control: SerializedShapeControl<T, U>,
): DeserializedShapeControl<
  T,
  { [K in keyof U]: DeserializedPanelControl<SerializedPanelControlValueType<U[K]>> }
> {
  const { type } = control.options
  const deserializedType = {} as {
    [K in keyof U]: DeserializedPanelControl<SerializedPanelControlValueType<U[K]>>
  }

  Object.entries(type).forEach(([key, control]) => {
    deserializedType[key as keyof typeof type] = deserializeControl(
      control,
    ) as DeserializedPanelControl
  })

  // @ts-expect-error: preset types are incompatible
  return { ...control, options: { ...control.options, type: deserializedType } }
}

function serializeListControlDefinition(
  definition: ListControlDefinition,
): [Serialize<ListControlDefinition>, Transferable[]] {
  const [type, transferables] = serializeControl(definition.config.type)
  const getItemLabel =
    definition.config.getItemLabel && serializeFunction(definition.config.getItemLabel)

  if (getItemLabel) transferables.push(getItemLabel)

  return [
    { ...definition, config: { ...definition.config, type, getItemLabel } },
    transferables,
  ] as [Serialize<ListControlDefinition>, Transferable[]]
}

function deserializeListControlDefinition(
  definition: Serialize<ListControlDefinition>,
): Deserialize<Serialize<ListControlDefinition>> {
  const type = deserializeControl(definition.config.type)
  const getItemLabel =
    definition.config.getItemLabel && deserializeFunction(definition.config.getItemLabel)

  return {
    ...definition,
    config: { ...definition.config, type, getItemLabel },
  } as Deserialize<Serialize<ListControlDefinition>>
}

function serializeListControl<T extends Data>(
  control: ListControl<ListControlValue<T>>,
): [SerializedListControl<ListControlValue<T>>, Transferable[]] {
  const { type, getItemLabel } = control.options
  const transferables: Transferable[] = []

  const [serializedType, serializedTypeTransferables] = serializeControl(type)
  const serializedGetItemLabel = getItemLabel && serializeFunction(getItemLabel)

  transferables.push(...serializedTypeTransferables)
  if (serializedGetItemLabel != null) transferables.push(serializedGetItemLabel)

  return [
    {
      ...control,
      options: {
        ...control.options,
        type: serializedType as SerializedPanelControl,
        getItemLabel: serializedGetItemLabel,
      },
    },
    transferables,
  ]
}

function deserializeListControl<T extends Data>(
  serializedControl: SerializedListControl<ListControlValue<T>>,
): DeserializedListControl<ListControlValue<T>> {
  const { type, getItemLabel } = serializedControl.options

  const deserializedType = deserializeControl(type) as DeserializedPanelControl
  const deserializedGetItemLabel = getItemLabel && deserializeFunction(getItemLabel)

  return {
    ...serializedControl,
    options: {
      ...serializedControl.options,
      type: deserializedType,
      getItemLabel: deserializedGetItemLabel,
    },
  }
}

function serializeTypeaheadControl<T extends Data>(
  control: TypeaheadControl<TypeaheadControlValue<T>>,
): [SerializedTypeaheadControl<TypeaheadControlValue<T>>, Transferable[]] {
  const { getItems } = control.options

  const serializedGetItems = getItems && serializeFunction(getItems)

  return [
    { ...control, options: { ...control.options, getItems: serializedGetItems } },
    serializedGetItems == null ? [] : [serializedGetItems],
  ]
}

function deserializeTypeaheadControl<T extends Data>(
  serializedControl: SerializedTypeaheadControl<TypeaheadControlValue<T>>,
): DeserializedTypeaheadControl<TypeaheadControlValue<T>> {
  const { getItems } = serializedControl.options

  const deserializedGetItems = getItems && deserializeFunction(getItems)

  return {
    ...serializedControl,
    options: { ...serializedControl.options, getItems: deserializedGetItems },
  }
}

function serializeGapXControl(control: GapXControl): [SerializedGapXControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeGapXControl(serializedControl: SerializedGapXControl): DeserializedGapXControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeGapYControl(control: GapYControl): [SerializedGapYControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeGapYControl(serializedControl: SerializedGapYControl): DeserializedGapYControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeResponsiveNumberControl(
  control: ResponsiveNumberControl,
): [SerializedResponsiveNumberControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeResponsiveNumberControl(
  serializedControl: SerializedResponsiveNumberControl,
): DeserializedResponsiveNumberControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeCheckboxControl(
  control: CheckboxControl,
): [SerializedCheckboxControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeCheckboxControl(
  serializedControl: SerializedCheckboxControl,
): DeserializedCheckboxControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeResponsiveColorControl(
  control: ResponsiveColorControl,
): [SerializedResponsiveColorControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeResponsiveColorControl(
  serializedControl: SerializedResponsiveColorControl,
): DeserializedResponsiveColorControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeNumberControl(control: NumberControl): [SerializedNumberControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeNumberControl(
  serializedControl: SerializedNumberControl,
): DeserializedNumberControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeResponsiveIconRadioGroupControl(
  control: ResponsiveIconRadioGroupControl,
): [SerializedResponsiveIconRadioGroupControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeResponsiveIconRadioGroupControl(
  serializedControl: SerializedResponsiveIconRadioGroupControl,
): DeserializedResponsiveIconRadioGroupControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeDateControl(control: DateControl): [SerializedDateControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeDateControl(serializedControl: SerializedDateControl): DeserializedDateControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeLinkControl(control: LinkControl): [SerializedLinkControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeLinkControl(serializedControl: SerializedLinkControl): DeserializedLinkControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeTextInputControl(
  control: TextInputControl,
): [SerializedTextInputControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeTextInputControl(
  serializedControl: SerializedTextInputControl,
): DeserializedTextInputControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeResponsiveSelectControl(
  control: ResponsiveSelectControl,
): [SerializedResponsiveSelectControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeResponsiveSelectControl(
  serializedControl: SerializedResponsiveSelectControl,
): DeserializedResponsiveSelectControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeResponsiveLengthControl(
  control: ResponsiveLengthControl,
): [SerializedResponsiveLengthControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeResponsiveLengthControl(
  serializedControl: SerializedResponsiveLengthControl,
): DeserializedResponsiveLengthControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeTextStyleControl(
  control: TextStyleControl,
): [SerializedTextStyleControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeTextStyleControl(
  serializedControl: SerializedTextStyleControl,
): DeserializedTextStyleControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

function serializeStyleV2Control(
  definition: StyleV2ControlDefinition,
): [Serialize<StyleV2ControlDefinition>, Transferable[]] {
  const [type, transferables] = serializeControl(definition.config.type)
  const getStyle = definition.config.getStyle && serializeFunction(definition.config.getStyle)

  if (getStyle) {
    transferables.push(getStyle)
  }

  return [
    {
      ...definition,
      config: {
        ...definition.config,
        type,
        getStyle,
      },
    },
    transferables,
  ] as [Serialize<StyleV2ControlDefinition>, Transferable[]]
}

function deserializeStyleV2Control(
  definition: Serialize<StyleV2ControlDefinition>,
): Deserialize<Serialize<StyleV2ControlDefinition>> {
  const type = deserializeControl(definition.config.type)
  const getStyle = definition.config.getStyle && deserializeFunction(definition.config.getStyle)

  return {
    ...definition,
    config: {
      ...definition.config,
      getStyle,
      type,
    },
  } as Deserialize<Serialize<StyleV2ControlDefinition>>
}

function serializeImageControl(control: ImageControl): [SerializedImageControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeImageControl(
  serializedControl: SerializedImageControl,
): DeserializedImageControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

export function serializeRichTextControlV2(
  definition: RichTextV2ControlDefinition,
): [Serialize<RichTextV2ControlDefinition>, Transferable[]] {
  const { plugins, ...config } = definition.config
  const transferables: Transferable[] = []

  return [
    {
      ...definition,
      config: {
        ...config,
        plugins:
          plugins?.map(plugin => {
            const onKeyDown = plugin.onKeyDown && serializeFunction(plugin.onKeyDown)
            if (onKeyDown) transferables.push(onKeyDown)
            const withPlugin = plugin.withPlugin && serializeFunction(plugin.withPlugin)
            if (withPlugin) transferables.push(withPlugin)

            if (plugin.control) {
              const [definition, pluginTransferables] = serializeControl(plugin.control.definition)
              transferables.push(...pluginTransferables)
              const getValue = serializeFunction(plugin.control.getValue)
              if (getValue) transferables.push(getValue)
              const onChange = serializeFunction(plugin.control.onChange)
              if (onChange) transferables.push(onChange)

              return {
                control: {
                  definition,
                  onChange,
                  getValue,
                },
                onKeyDown,
                withPlugin,
              }
            }

            return {
              onKeyDown,
              withPlugin,
            }
          }) ?? [],
      },
    },
    transferables,
  ] as [Serialize<RichTextV2ControlDefinition>, Transferable[]]
}

export function deserializeRichTextControlV2(
  definition: Serialize<RichTextV2ControlDefinition>,
): Deserialize<Serialize<RichTextV2ControlDefinition>> {
  return {
    ...definition,
    config: {
      ...definition.config,
      plugins:
        definition.config.plugins?.map(plugin => {
          // TODO: you shouldn't need to cast all the functions
          // There is a type missmatch where functions within the plugin aren't typed as Serialize<T>
          // This prevents them from being used with `deserializeFunction`
          const onKeyDown = plugin.onKeyDown && deserializeFunction(plugin.onKeyDown as any)
          const withPlugin = plugin.withPlugin && deserializeFunction(plugin.withPlugin as any)

          if (plugin.control) {
            const definition = deserializeControl(plugin.control.definition as any)
            const getValue = deserializeFunction(plugin.control.getValue as any)
            const onChange = deserializeFunction(plugin.control.onChange as any)

            return {
              control: {
                definition,
                onChange,
                getValue,
              },
              onKeyDown,
              withPlugin,
            }
          }

          return {
            onKeyDown,
            withPlugin,
          }
        }) ?? [],
    },
  } as Deserialize<Serialize<RichTextV2ControlDefinition>>
}

function serializeRichTextControl(
  control: RichTextControl,
): [SerializedRichTextControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

function deserializeRichTextControl(
  serializedControl: SerializedRichTextControl,
): DeserializedRichTextControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

export function serializeControl<T extends Data>(
  control: Control<T>,
): [SerializedControl<T>, Transferable[]] {
  switch (control.type) {
    case Controls.Types.Checkbox:
      return serializeCheckboxControl(control)

    case Controls.Types.List:
      return serializeListControl(control)

    case Controls.Types.Shape:
      return serializeShapeControl(control)

    case Controls.Types.Typeahead:
      return serializeTypeaheadControl(control)

    case Controls.Types.GapX:
      return serializeGapXControl(control)

    case Controls.Types.GapY:
      return serializeGapYControl(control)

    case Controls.Types.ResponsiveColor:
      return serializeResponsiveColorControl(control)

    case Controls.Types.ResponsiveNumber:
      return serializeResponsiveNumberControl(control)

    case Controls.Types.Number:
      return serializeNumberControl(control)

    case Controls.Types.ResponsiveIconRadioGroup:
      return serializeResponsiveIconRadioGroupControl(control)

    case Controls.Types.ResponsiveSelect:
      return serializeResponsiveSelectControl(control)

    case Controls.Types.ResponsiveLength:
      return serializeResponsiveLengthControl(control)

    case Controls.Types.Date:
      return serializeDateControl(control)

    case Controls.Types.Link:
      return serializeLinkControl(control)

    case Controls.Types.TextInput:
      return serializeTextInputControl(control)

    case Controls.Types.TextStyle:
      return serializeTextStyleControl(control)

    case Controls.Types.Image:
      return serializeImageControl(control)

    case Controls.Types.RichText:
      return serializeRichTextControl(control)

    case RichTextV2ControlType:
      return serializeRichTextControlV2(control)

    case StyleV2ControlType:
      return serializeStyleV2Control(control)

    case ComboboxControlType:
      return serializeComboboxControlDefinition(control)

    case ShapeControlType:
      return serializeShapeControlDefinition(control)

    case ListControlType:
      return serializeListControlDefinition(control)

    default:
      return [control, []]
  }
}

export function deserializeControl<T extends Data>(
  serializedControl: SerializedControl<T>,
): DeserializedControl<T> {
  switch (serializedControl.type) {
    case Controls.Types.Checkbox:
      return deserializeCheckboxControl(serializedControl)

    case Controls.Types.List:
      return deserializeListControl(serializedControl)

    case Controls.Types.Shape:
      return deserializeShapeControl(serializedControl)

    case Controls.Types.Typeahead:
      return deserializeTypeaheadControl(serializedControl)

    case Controls.Types.GapX:
      return deserializeGapXControl(serializedControl)

    case Controls.Types.GapY:
      return deserializeGapYControl(serializedControl)

    case Controls.Types.ResponsiveColor:
      return deserializeResponsiveColorControl(serializedControl)

    case Controls.Types.ResponsiveNumber:
      return deserializeResponsiveNumberControl(serializedControl)

    case Controls.Types.Number:
      return deserializeNumberControl(serializedControl)

    case Controls.Types.ResponsiveIconRadioGroup:
      return deserializeResponsiveIconRadioGroupControl(serializedControl)

    case Controls.Types.ResponsiveSelect:
      return deserializeResponsiveSelectControl(serializedControl)

    case Controls.Types.ResponsiveLength:
      return deserializeResponsiveLengthControl(serializedControl)

    case Controls.Types.Date:
      return deserializeDateControl(serializedControl)

    case Controls.Types.Link:
      return deserializeLinkControl(serializedControl)

    case Controls.Types.TextInput:
      return deserializeTextInputControl(serializedControl)

    case Controls.Types.TextStyle:
      return deserializeTextStyleControl(serializedControl)

    case Controls.Types.Image:
      return deserializeImageControl(serializedControl)

    case Controls.Types.RichText:
      return deserializeRichTextControl(serializedControl)

    case RichTextV2ControlType:
      return deserializeRichTextControlV2(serializedControl)

    case StyleV2ControlType:
      return deserializeStyleV2Control(serializedControl)

    case ComboboxControlType:
      return deserializeComboboxControlDefinition(serializedControl)

    case ShapeControlType:
      return deserializeShapeControlDefinition(serializedControl)

    case ListControlType:
      return deserializeListControlDefinition(serializedControl)

    default:
      return serializedControl
  }
}

export function serializeControls(
  controls: Record<string, Control>,
): [Record<string, SerializedControl>, Transferable[]] {
  return Object.entries(controls).reduce(
    ([accControls, accTransferables], [key, control]) => {
      const [serializedControl, transferables] = serializeControl(control)

      return [{ ...accControls, [key]: serializedControl }, [...accTransferables, ...transferables]]
    },
    [{}, []] as [Record<string, SerializedControl>, Transferable[]],
  )
}

export function deserializeControls(
  serializedControls: Record<string, SerializedControl>,
): Record<string, DeserializedControl> {
  return Object.entries(serializedControls).reduce(
    (deserializedControls, [key, serializedControl]) => {
      return { ...deserializedControls, [key]: deserializeControl(serializedControl) }
    },
    {} as Record<string, DeserializedControl>,
  )
}

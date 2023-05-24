import { RichTextV2ControlDefinition } from '../../../controls'
import { deserializeControl, serializeControl } from '../control-serialization'
import { deserializeFunction, serializeFunction } from '../function-serialization'
import { Deserialize, Serialize } from './types'

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

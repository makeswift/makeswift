import { RichTextV2ControlDefinition } from '../../../controls'
import { Deserialize, Serialize } from './types'

export function serializeRichTextControlV2(
  control: RichTextV2ControlDefinition,
): [Serialize<RichTextV2ControlDefinition>, Transferable[]] {
  const { plugins, ...config } = control.config
  const transferables: Transferable[] = []

  return [
    {
      ...control,
      config: {
        ...config,
        plugins:
          plugins?.map(plugin => {
            return {
              control: {
                definition: plugin?.control?.definition,
              },
            }
          }) ?? [],
      },
    },
    transferables,
  ] as [Serialize<RichTextV2ControlDefinition>, Transferable[]]
}

export function deserializeRichTextControlV2(
  control: Serialize<RichTextV2ControlDefinition>,
): Deserialize<Serialize<RichTextV2ControlDefinition>> {
  return control as Deserialize<Serialize<RichTextV2ControlDefinition>>
}

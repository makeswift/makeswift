import { match } from 'ts-pattern'
import { z } from 'zod'

import { mapValues } from '../../../lib/functional'

import {
  SerializationSchema,
  type DeserializedRecord,
} from '../../../serialization'
import { type ControlDefinition } from '../../definition'
import { Group, GroupDefinition } from '../../group'

// `ShapeV2` was an early version of what is now the `Group` control, briefly
// made available in the 0.23 release candidate. Its implementation below has
// been reduced to a single `deserialize` method, converts a deserialized
// `ShapeV2` into a `Group` with `ShapeV2`'s data signature.
class Definition {
  static readonly type = 'makeswift::controls::shape-v2' as const
  static readonly v1DataType = 'shape-v2::v1' as const

  static readonly Layout = {
    Inline: `${this.type}::layout::inline`,
    Popover: `${this.type}::layout::popover`,
  } as const

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): GroupDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `ShapeV2: expected '${Definition.type}', got '${data.type}'`,
      )

    const {
      config: { type, layout, ...config },
    } = z
      .object({
        type: z.literal(Definition.type),
        config: z.object({
          label: z.string().optional(),
          layout: z
            .union([
              z.literal(Definition.Layout.Inline),
              z.literal(Definition.Layout.Popover),
            ])
            .optional(),
          type: z.record(z.string(), SerializationSchema.deserializedRecord),
        }),
      })
      .parse(data)

    const deserializedProps = mapValues(type, (itemDef) => {
      return deserializeCallback(itemDef)
    })

    return new GroupDefinition(
      {
        props: deserializedProps,
        preferredLayout: match(layout)
          .with(Definition.Layout.Inline, () => Group.Layout.Inline)
          .with(Definition.Layout.Popover, () => Group.Layout.Popover)
          .otherwise(() => undefined),
        ...config,
      },
      Definition.v1DataType,
    )
  }
}

export class ShapeV2Definition extends Definition {}

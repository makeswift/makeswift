import {
  type SerializedRecord,
  type ResourceResolver,
  type Effector,
  type Resolvable,
  type DataType,
  StyleV2Definition,
  StyleV2Control,
  ControlDefinition,
  ResolvedValueType,
  ResponsiveValue,
  mapValues,
  deepEqual,
} from '@makeswift/controls'

import { CSSObject } from '@emotion/serialize'
import { z } from 'zod'

type ResolvedStyles = ResponsiveValue<CSSObject>

type Config<Item extends ControlDefinition> = {
  type: Item
  getStyle: (val: ResolvedValueType<Item>) => CSSObject
}

class Definition<Item extends ControlDefinition = ControlDefinition> extends StyleV2Definition<
  CSSObject,
  Config<Item>
> {
  static deserialize(
    data: SerializedRecord,
    deserializeCallback: (r: SerializedRecord) => ControlDefinition,
  ) {
    if (data.type !== Definition.type) {
      throw new Error(`StyleV2: expected type ${Definition.type}, got ${data.type}`)
    }

    const {
      config: { type, ...config },
    } = Definition.schema({ typeDef: z.any() }).definition.parse(data)

    const typeDef = deserializeCallback(type)

    return new Definition({ type: typeDef, ...config })
  }

  resolveValue(
    data: DataType<StyleV2Definition<CSSObject, Config<Item>>> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    control?: StyleV2Control<CSSObject>,
  ): Resolvable<ResolvedStyles | undefined> {
    const responsiveValues = Object.fromEntries(
      data?.map(item => [
        item.deviceId,
        this.typeDef.resolveValue(item.value, resolver, effector, control?.getChildControl()),
      ]) ?? [],
    )

    return {
      // TODO: review
      readStableValue: (previous?: ResolvedStyles) => {
        // return previous
        const r = mapValues(responsiveValues, item => item.readStableValue())
        const newStyles = data?.map(item => ({
          deviceId: item.deviceId,
          value: this.config.getStyle(r[item.deviceId]),
        }))
        if (deepEqual(newStyles, previous)) return previous
        return newStyles
      },
      subscribe: (onUpdate: () => void) => {
        const unsubscribes = Object.entries(responsiveValues).map(([, item]) =>
          item.subscribe(onUpdate),
        )
        return () => unsubscribes?.forEach(u => u())
      },
      triggerResolve: async (currentValue: ResolvedStyles) => {
        const subResolves =
          Object.values(mapValues(responsiveValues, item => item.triggerResolve(currentValue))) ??
          []
        await Promise.all([...subResolves])
      },
    }
  }
}

// TODO: review
export const unstable_StyleV2 = <Item extends ControlDefinition = ControlDefinition>(
  config: Config<Item>,
) => new (class unstable_StyleV2 extends Definition<Item> {})(config)
export { Definition as StyleV2Definition }

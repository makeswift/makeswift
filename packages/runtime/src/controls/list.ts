import { CopyContext } from '../state/react-page'
import { ControlDefinition, ControlDefinitionData } from './control'

import { copy as controlCopy } from './control'

export const ListControlType = 'makeswift::controls::list'

type ListControlConfig<T extends ControlDefinition = ControlDefinition> = {
  type: T
  label?: string
  /**
   * @todos
   * - Make `item` the control's transformed "value" instead of "data."
   */
  getItemLabel?(item: ControlDefinitionData<T> | undefined): string
}

export type ListControlDefinition<C extends ListControlConfig = ListControlConfig> = {
  type: typeof ListControlType
  config: C
}

export function List<T extends ControlDefinition, C extends ListControlConfig<T>>(
  config: C & { type: T },
): ListControlDefinition<C> {
  return { type: ListControlType, config }
}

export type ListControlItemData<T extends ListControlDefinition> = {
  id: string
  type: T['config']['type']['type']
  value: ControlDefinitionData<T['config']['type']>
}

export type ListControlData<T extends ListControlDefinition = ListControlDefinition> =
  ListControlItemData<T>[]

export function copyListData(
  definition: ListControlDefinition,
  value: ListControlData | undefined,
  context: CopyContext,
): ListControlData | undefined {
  if (value == null) return value

  return (
    value &&
    value.map(item => ({
      ...item,
      value: controlCopy(definition.config.type, item.value, context),
    }))
  )
}

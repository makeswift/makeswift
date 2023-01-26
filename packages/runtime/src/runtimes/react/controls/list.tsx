import { ListControl, ListControlData, ListControlDefinition } from '../../../controls'
import { ControlDefinitionValue, ControlValue } from './control'

type ListControlItemValue<T extends ListControlDefinition> = ControlDefinitionValue<
  T['config']['type']
>

export type ListControlValue<T extends ListControlDefinition> = ListControlItemValue<T>[]

type ListControlValueProps<T extends ListControlDefinition> = {
  definition: T
  data: ListControlData<T> | undefined
  children(value: ListControlValue<T>): JSX.Element
  control?: ListControl
}

export function ListControlValue<T extends ListControlDefinition>({
  definition,
  data,
  children,
  control,
}: ListControlValueProps<T>): JSX.Element {
  return (data ?? []).reduce(
    (renderFn, item) => listControlValue =>
      (
        <ControlValue
          definition={definition.config.type}
          data={item.value}
          control={control?.controls.get(item.id)}
        >
          {value => renderFn([value as ListControlItemValue<T>, ...listControlValue])}
        </ControlValue>
      ),
    children,
  )([])
}

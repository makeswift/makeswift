import { useEffect, useState } from 'react'
import { ListControl, ListControlData, ListControlDefinition } from '../../../controls'
import { AnyPropController } from '../../../prop-controllers/instances'
import { ControlDefinitionValue, ControlValue } from './control'

type ListControlItemValue<T extends ListControlDefinition> = ControlDefinitionValue<
  T['config']['type']
>

export type ListControlValue<T extends ListControlDefinition> = ListControlItemValue<T>[]

type ListControlValueProps<T extends ListControlDefinition> = {
  definition: T
  data: ListControlData<T> | undefined
  children(value: ListControlValue<T>): JSX.Element
  control: ListControl
}

export function ListControlValue<T extends ListControlDefinition>({
  definition,
  data,
  children,
  control,
}: ListControlValueProps<T>): JSX.Element {
  const [controls, setControls] = useState<Map<string, AnyPropController> | undefined>(new Map())

  useEffect(() => {
    if (control == null || data == null) return

    // This is not ideal because we're setting the itemsControl from the ListControlValue.
    // This is because right now we don't have a subscribeToValue function inside the control.
    // We can improve this by adding the subscribeToValue to createPropController and by
    // moving the setItemsControl to the control itself.
    setControls(control.setItemsControl(data))
  }, [data, control])

  return (data ?? []).reduce(
    (renderFn, item) => listControlValue =>
      (
        <ControlValue
          definition={definition.config.type}
          data={item.value}
          control={controls?.get(item.id)}
        >
          {value => renderFn([value as ListControlItemValue<T>, ...listControlValue])}
        </ControlValue>
      ),
    children,
  )([])
}

import { useEffect, useState } from 'react'

import { ControlInstance, type DataType, type ResolvedValueType } from '@makeswift/controls'

import { ListDefinition, ListControl } from '../../../controls'

import { ControlValue } from './control'

type ListControlValueProps = {
  definition: ListDefinition
  data: DataType<ListDefinition> | undefined
  children(value: ResolvedValueType<ListDefinition>): JSX.Element
  control: ListControl
}

export function ListControlValue({
  definition,
  data,
  children,
  control,
}: ListControlValueProps): JSX.Element {
  const [controls, setControls] = useState<Map<string, ControlInstance> | undefined>(new Map())

  useEffect(() => {
    if (control == null || data == null) return

    // This is not ideal because we're setting the itemsControl from the ListControlValue.
    // This is because right now we don't have a subscribeToValue function inside the control.
    // We can improve this by adding the subscribeToValue to createPropController and by
    // moving the setItemsControl to the control itself.
    const childControls = control.childControls(data.map(item => item.id))
    control.setChildControls(childControls)
    setControls(childControls)
  }, [data, control])

  return (data ?? []).reduce(
    (renderFn, item) => listControlValue => (
      <ControlValue
        definition={definition.config.type}
        data={item.value}
        control={controls?.get(item.id)}
      >
        {value => renderFn([value, ...listControlValue])}
      </ControlValue>
    ),
    children,
  )([])
}

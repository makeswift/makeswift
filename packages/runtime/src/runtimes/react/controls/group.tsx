import {
  GroupControl,
  GroupDefinition,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'

import { ControlValue } from './control'

type GroupControlValueProps = {
  definition: GroupDefinition
  data: DataType<GroupDefinition> | undefined
  children(value: ResolvedValueType<GroupDefinition>): JSX.Element
  control: GroupControl
}

export function GroupControlValue({ definition, data, children, control }: GroupControlValueProps) {
  return Object.entries(definition.config.props).reduceRight(
    (renderFn, [key, controlDefinition]) =>
      shapeControlValue => (
        <ControlValue
          definition={controlDefinition}
          data={data != null ? GroupDefinition.propsData(data)[key] : undefined}
          control={control?.child(key)}
        >
          {value => renderFn({ ...shapeControlValue, [key]: value })}
        </ControlValue>
      ),
    children,
  )({} as ResolvedValueType<GroupDefinition>)
}

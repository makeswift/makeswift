import { CopyContext, Data } from '../../state/react-page'
import { GridValue } from '../descriptors'

export function copy(value: GridValue | undefined, context: CopyContext): Data | undefined {
  if (value == null) return undefined

  return {
    ...value,
    elements: value.elements.map(element => context.copyElement(element)),
  }
}

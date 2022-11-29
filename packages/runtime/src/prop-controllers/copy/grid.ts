import { CopyContext, Data } from '../../state/react-page'
import { GridValue } from '../descriptors'

export function copy(value: GridValue, context: CopyContext): Data {
  return {
    ...value,
    elements: value.elements.map(element => context.copyElement(element)),
  }
}

import { CopyContext } from '../../state/react-page'
import { TableValue } from '../descriptors'

export function copy(value: TableValue | undefined, context: CopyContext): TableValue | undefined {
  if (value == null) return value

  return context.replacementContext.tableIds.get(value) ?? value
}

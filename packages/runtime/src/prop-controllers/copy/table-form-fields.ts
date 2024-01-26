import { CopyContext } from '../../state/react-page'
import { TableFormFieldsValue } from '../descriptors'

export function copy(
  value: TableFormFieldsValue | undefined,
  context: CopyContext,
): TableFormFieldsValue | undefined {
  if (value == null) return value

  return { ...value, fields: value.fields.map(copyFormFieldsPanelItem) }

  function copyFormFieldsPanelItem(item: any): any {
    return {
      ...item,
      tableColumnId:
        context.replacementContext.tableColumnIds.get(item.tableColumnId) ?? item.tableColumnId,
    }
  }
}

import {
  TablePropControllerData,
  getTablePropControllerDataTableId,
} from '@makeswift/prop-controllers'

export function useTablePropControllerData(
  data: TablePropControllerData | undefined,
): string | undefined {
  if (data == null) return data

  return getTablePropControllerDataTableId(data)
}

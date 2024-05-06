import {
  GridPropControllerData,
  GridData,
  getGridPropControllerDataGridData,
} from '@makeswift/prop-controllers'

export function useGridPropControllerData(
  data: GridPropControllerData | undefined,
): GridData | undefined {
  return getGridPropControllerDataGridData(data)
}

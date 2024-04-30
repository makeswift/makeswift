import {
  TableFormFieldsPropControllerData,
  TableFormFieldsData,
  getTableFormFieldsPropControllerDataTableFormFieldsData,
} from '@makeswift/prop-controllers'

export function useTableFormFieldsPropControllerData(
  data: TableFormFieldsPropControllerData | undefined,
): TableFormFieldsData | undefined {
  return getTableFormFieldsPropControllerDataTableFormFieldsData(data)
}

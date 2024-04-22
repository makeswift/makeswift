import {
  DatePropControllerData,
  getDatePropControllerDataString,
} from '@makeswift/prop-controllers'

export function useDatePropControllerData(
  data: DatePropControllerData | undefined,
): string | undefined {
  if (data == null) return data

  return getDatePropControllerDataString(data)
}

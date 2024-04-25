import {
  LinkPropControllerData,
  LinkData,
  getLinkPropControllerDataLinkData,
} from '@makeswift/prop-controllers'

export function useLinkPropControllerData(
  data: LinkPropControllerData | undefined | null,
): LinkData | undefined | null {
  if (data == null) return data

  return getLinkPropControllerDataLinkData(data)
}

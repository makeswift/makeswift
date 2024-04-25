import {
  NavigationLinksData,
  NavigationLinksPropControllerData,
  getNavigationLinksPropControllerDataNavigationLinksData,
} from '@makeswift/prop-controllers'

export function useNavigationLinksPropControllerData(
  data: NavigationLinksPropControllerData | undefined,
): NavigationLinksData | undefined {
  if (data == null) return data

  return getNavigationLinksPropControllerDataNavigationLinksData(data)
}

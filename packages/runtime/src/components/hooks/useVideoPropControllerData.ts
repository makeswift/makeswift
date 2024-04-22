import {
  VideoPropControllerData,
  VideoData,
  getVideoPropControllerDataVideoData,
} from '@makeswift/prop-controllers'

export function useVideoPropControllerData(
  data: VideoPropControllerData | undefined,
): VideoData | undefined {
  if (data == null) return data

  return getVideoPropControllerDataVideoData(data)
}

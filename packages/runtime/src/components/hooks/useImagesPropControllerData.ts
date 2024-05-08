import {
  ImagesData,
  ImagesPropControllerData,
  getImagesPropControllerDataImagesData,
} from '@makeswift/prop-controllers'

export function useImagesPropControllerData(
  data: ImagesPropControllerData | undefined,
): ImagesData | undefined {
  return getImagesPropControllerDataImagesData(data)
}

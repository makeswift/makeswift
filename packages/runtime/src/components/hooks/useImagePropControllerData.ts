import {
  ImageData,
  ImagePropControllerData,
  getImagePropControllerDataImageData,
} from '@makeswift/prop-controllers'

export function useImagePropControllerData(
  data: ImagePropControllerData | undefined,
): ImageData | undefined {
  return getImagePropControllerDataImageData(data)
}

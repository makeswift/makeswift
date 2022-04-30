import { useFile } from '../../../components'
import { ImageControlData } from '../../../controls'

export type ImageControlValue = string | undefined

export function useImageControlValue(data: ImageControlData | undefined): ImageControlValue {
  return useFile(data)?.publicUrl
}

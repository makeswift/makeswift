import { useMemo } from 'react'

import { ColorValue as Color } from '../utils/types'
import { ResponsiveValue } from '../../prop-controllers'
import { FILES_BY_ID, SWATCHES_BY_ID } from '../utils/queries'
import { isNonNullable } from '../utils/isNonNullable'
import { BackgroundsValue as ResponsiveBackgroundsValue } from '../../prop-controllers/descriptors'
import { useQuery } from '../../api/react'

type BackgroundColorData = Color

type BackgroundGradientStopData = {
  id: string
  location: number
  color: Color | null | undefined
}

type BackgroundGradientData = {
  angle: number
  isRadial: boolean
  stops: Array<BackgroundGradientStopData>
}

type BackgroundImageData = {
  publicUrl?: string
  dimensions: { width: number; height: number } | null
  position: {
    x: number
    y: number
  }
  size: 'cover' | 'contain' | 'auto'
  repeat: 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat'
  opacity?: number
  parallax?: number
}

type BackgroundVideoData = {
  url: string
  maskColor: Color | null | undefined
  aspectRatio: 'wide' | 'standard'
  opacity: number
  zoom: number
  parallax: number
}

type BackgroundData =
  | { id: string; type: 'color'; payload: BackgroundColorData | null | undefined }
  | { id: string; type: 'image'; payload: BackgroundImageData | null | undefined }
  | { id: string; type: 'gradient'; payload: BackgroundGradientData | null | undefined }
  | { id: string; type: 'video'; payload: BackgroundVideoData | null | undefined }

type BackgroundsData = Array<BackgroundData>

export type BackgroundsPropControllerData = ResponsiveValue<BackgroundsData>

export function useBackgrounds(
  value: ResponsiveBackgroundsValue | null | undefined,
): BackgroundsPropControllerData | null | undefined {
  const fileIds =
    value == null
      ? []
      : value
          .map(({ value: backgrounds }) =>
            backgrounds
              .map(background =>
                background.type === 'image' && background.payload != null
                  ? background.payload.imageId
                  : null,
              )
              .filter(isNonNullable)
              .reduce((a, b) => a.concat(b), [] as string[]),
          )
          .reduce((a, b) => a.concat(b), [])
  const swatchIds =
    value == null
      ? []
      : value
          .map(({ value: backgrounds }) =>
            backgrounds
              .map(background => {
                if (background.type === 'color' && background.payload != null) {
                  return [background.payload.swatchId]
                }

                if (background.type === 'gradient' && background.payload != null) {
                  return background.payload.stops
                    .map(stop => stop.color && stop.color.swatchId)
                    .filter(isNonNullable)
                }

                if (background.type === 'video' && background.payload != null) {
                  return [background.payload.maskColor && background.payload.maskColor.swatchId]
                }

                return null
              })
              .filter(isNonNullable)
              .reduce((a, b) => a.concat(b), []),
          )
          .reduce((a, b) => a.concat(b), [])
          .filter(isNonNullable)
  const skip = value == null
  const filesResult = useQuery(FILES_BY_ID, {
    skip: skip || fileIds.length === 0,
    variables: { ids: fileIds },
  })
  const swatchesResult = useQuery(SWATCHES_BY_ID, {
    skip: skip || swatchIds.length === 0,
    variables: { ids: swatchIds },
  })

  return useMemo(() => {
    const { data: filesData = {} } = filesResult
    const { data: swatchesData = {} } = swatchesResult

    if (value == null || filesResult.error != null || swatchesResult.error != null) {
      return null
    }

    const { files = [] } = filesData
    const { swatches = [] } = swatchesData

    return value.map(({ value: backgrounds, ...restOfValue }) => ({
      ...restOfValue,
      value: backgrounds
        .map(bg => {
          if (bg.type === 'image' && bg.payload != null && bg.payload.imageId != null) {
            const { imageId, ...restOfPayload } = bg.payload
            const file = files.find((f: any) => f && f.id === imageId)

            return (
              file && {
                id: bg.id,
                type: 'image',
                payload: {
                  ...restOfPayload,
                  publicUrl: file.publicUrl,
                  dimensions: file.dimensions,
                },
              }
            )
          }

          if (bg.type === 'color' && bg.payload != null) {
            const { swatchId, alpha } = bg.payload
            const swatch = swatches.find((s: any) => s && s.id === swatchId)

            return { id: bg.id, type: 'color', payload: { swatch, alpha } }
          }

          if (bg.type === 'gradient' && bg.payload != null && bg.payload.stops.length > 0) {
            return {
              id: bg.id,
              type: 'gradient',
              payload: {
                angle: bg.payload.angle,
                isRadial: bg.payload.isRadial,
                stops: bg.payload.stops.map(({ color, ...restOfStop }) => ({
                  ...restOfStop,
                  color: color && {
                    swatch: swatches.find((s: any) => s && s.id === color.swatchId),
                    alpha: color.alpha,
                  },
                })),
              },
            }
          }

          if (bg.type === 'video' && bg.payload != null) {
            const { maskColor, ...restOfPayload } = bg.payload
            const swatch = maskColor && swatches.find((s: any) => s && s.id === maskColor.swatchId)

            return {
              id: bg.id,
              type: 'video',
              payload: {
                ...restOfPayload,
                maskColor: swatch && maskColor && { swatch, alpha: maskColor.alpha },
              },
            }
          }

          return null
        })
        .filter(Boolean),
    }))
  }, [filesResult, swatchesResult, value])
}

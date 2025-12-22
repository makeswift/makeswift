import { useMemo } from 'react'

import { ColorValue as Color } from '../utils/types'
import { type ResponsiveValue } from '@makeswift/controls'
import { isNonNullable } from '../utils/isNonNullable'
import { useFiles, useSwatches } from '../../runtimes/react/hooks/makeswift-api'
import { match, P } from 'ts-pattern'
import {
  ResponsiveBackgroundsData,
  getBackgroundsPropControllerDataResponsiveBackgroundsData,
  getBackgroundsPropControllerFileIds,
  getBackgroundsPropControllerSwatchIds,
} from '@makeswift/prop-controllers'

type BackgroundColorData = Color

type BackgroundGradientStopData = {
  id: string
  location: number
  color: Color | null | undefined
}

type BackgroundGradientData = {
  angle?: number
  isRadial?: boolean
  stops: Array<BackgroundGradientStopData>
}

type BackgroundImageData = {
  publicUrl?: string
  dimensions?: { width: number; height: number } | null
  position: {
    x: number
    y: number
  }
  size?: 'cover' | 'contain' | 'auto'
  repeat?: 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat'
  opacity?: number
  parallax?: number
}

type BackgroundVideoData = {
  url?: string
  maskColor: Color | null | undefined
  aspectRatio?: 'wide' | 'standard'
  opacity?: number
  zoom?: number
  parallax?: number
}

type BackgroundData =
  | { id: string; type: 'color'; payload: BackgroundColorData | null | undefined }
  | { id: string; type: 'image'; payload: BackgroundImageData | null | undefined }
  | { id: string; type: 'gradient'; payload: BackgroundGradientData | null | undefined }
  | { id: string; type: 'video'; payload: BackgroundVideoData | null | undefined }

export type BackgroundsData = Array<BackgroundData>

export type BackgroundsPropControllerValue = ResponsiveValue<BackgroundsData>

export function useBackgrounds(
  data: ResponsiveBackgroundsData | undefined,
): BackgroundsPropControllerValue | undefined {
  const value = getBackgroundsPropControllerDataResponsiveBackgroundsData(data)
  const fileIds = getBackgroundsPropControllerFileIds(data)
  const files = useFiles(fileIds)
  const swatchIds = getBackgroundsPropControllerSwatchIds(data)
  const swatches = useSwatches(swatchIds)

  return useMemo(() => {
    if (value == null) return undefined

    return value.map(({ value: backgrounds, ...restOfValue }) => ({
      ...restOfValue,
      value: backgrounds
        .map((bg): BackgroundData | null | undefined => {
          if (bg.type === 'image' && bg.payload != null) {
            const { imageId, ...restOfPayload } = bg.payload
            const file = files.find(f => f && f.id === imageId)
            return (
              file && {
                ...bg,
                payload: {
                  ...restOfPayload,
                  publicUrl: file.publicUrl,
                  dimensions: file.dimensions,
                },
              }
            )
          }

          if (bg.type === 'image-v1' && bg.payload != null) {
            return match(bg)
              .with(
                {
                  payload: { image: { type: 'external-file', width: P.number, height: P.number } },
                },
                val => {
                  const { image, version, ...restOfPayload } = val.payload
                  return {
                    ...val,
                    type: 'image' as const,
                    payload: {
                      ...restOfPayload,
                      publicUrl: image.url,
                      dimensions: { width: image.width, height: image.height },
                    },
                  }
                },
              )
              .with({ payload: { image: { type: 'external-file' } } }, val => {
                const { image, version, ...restOfPayload } = val.payload
                return {
                  ...val,
                  type: 'image' as const,
                  payload: {
                    ...restOfPayload,
                    publicUrl: image.url,
                    dimensions: null,
                  },
                }
              })
              .with({ payload: { image: { type: 'makeswift-file' } } }, val => {
                const { image, version, ...restOfPayload } = val.payload
                const file = files.find(f => f && f.id === image.id)
                return (
                  file && {
                    ...val,
                    type: 'image' as const,
                    payload: {
                      ...restOfPayload,
                      publicUrl: file.publicUrl,
                      dimensions: file.dimensions,
                    },
                  }
                )
              })
              .otherwise(() => null)
          }

          if (bg.type === 'color' && bg.payload != null) {
            const { swatchId, alpha } = bg.payload
            const swatch = swatches.filter(isNonNullable).find(s => s && s.id === swatchId)

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
                    swatch: swatches.filter(isNonNullable).find(s => s && s.id === color.swatchId),
                    alpha: color.alpha,
                  },
                })),
              },
            }
          }

          if (bg.type === 'video' && bg.payload != null) {
            const { maskColor, ...restOfPayload } = bg.payload
            const swatch = maskColor && swatches.find(s => s && s.id === maskColor.swatchId)

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
        .filter(isNonNullable),
    }))
  }, [files, swatches, value])
}

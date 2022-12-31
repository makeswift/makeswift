import { useMemo } from 'react'

import { ColorValue as Color } from '../utils/types'
import { ResponsiveValue } from '../../prop-controllers'
import { isNonNullable } from '../utils/isNonNullable'
import { BackgroundsValue as ResponsiveBackgroundsValue } from '../../prop-controllers/descriptors'
import { useFiles, useSwatches } from '../../runtimes/react/hooks/makeswift-api'
import {
  getBackgroundsFileIds,
  getBackgroundsSwatchIds,
} from '../../prop-controllers/introspection'

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

export type BackgroundsPropControllerData = ResponsiveValue<BackgroundsData>

export function useBackgrounds(
  value: ResponsiveBackgroundsValue | null | undefined,
): BackgroundsPropControllerData | null | undefined {
  const fileIds = getBackgroundsFileIds(value)
  const files = useFiles(fileIds)
  const swatchIds = getBackgroundsSwatchIds(value)
  const swatches = useSwatches(swatchIds)

  return useMemo(() => {
    if (value == null) return null

    return value.map(({ value: backgrounds, ...restOfValue }) => ({
      ...restOfValue,
      value: backgrounds
        .map((bg): BackgroundData | null | undefined => {
          if (bg.type === 'image' && bg.payload != null && bg.payload.imageId != null) {
            const { imageId, ...restOfPayload } = bg.payload
            const file = files.find(f => f && f.id === imageId)

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

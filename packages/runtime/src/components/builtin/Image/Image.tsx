'use client'

import { useState, useEffect, Ref, forwardRef } from 'react'

import {
  LinkData,
  ResponsiveLengthData,
  ImageData,
  ResponsiveOpacityValue,
} from '@makeswift/prop-controllers'
import { type Breakpoints, findBreakpointOverride } from '@makeswift/controls'

import { placeholders } from '../../utils/placeholders'
import { Link } from '../../shared/Link'
import { cx } from '@emotion/css'
import { useStyle } from '../../../runtimes/react/use-style'
import { useResponsiveStyle, useResponsiveWidth } from '../../utils/responsive-style'
import { useFile } from '../../../runtimes/react/hooks/makeswift-api'
import { useBreakpoints } from '../../../runtimes/react/hooks/use-breakpoints'
import { useFrameworkContext } from '../../../runtimes/react/components/hooks/use-framework-context'
import { match, P } from 'ts-pattern'

type Props = {
  id?: string
  file?: ImageData
  altText?: string
  link?: LinkData
  width?: ResponsiveLengthData
  margin?: string
  padding?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  opacity?: ResponsiveOpacityValue
  placeholder?: { src: string; dimensions: { width: number; height: number } }
  className?: string
  priority?: boolean
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function imageSizes(breakpoints: Breakpoints, width?: Props['width']): string {
  const baseDevice = breakpoints.find(breakpoint => breakpoint.maxWidth == null)
  const baseWidth = baseDevice && width && findBreakpointOverride(breakpoints, width, baseDevice.id)
  const baseWidthSize =
    baseWidth == null || baseWidth.value.unit !== 'px' ? '100vw' : `${baseWidth.value.value}px`

  return breakpoints
    .map(breakpoint => {
      const override = findBreakpointOverride(breakpoints, width, breakpoint.id)

      if (override == null || breakpoint.maxWidth == null || override.value.unit !== 'px') {
        return null
      }

      return `(max-width: ${breakpoint.maxWidth}px) ${Math.min(
        breakpoint.maxWidth,
        override.value.value,
      )}px`
    })
    .filter((size): size is NonNullable<typeof size> => size != null)
    .reduce((sourceSizes, sourceSize) => `${sourceSize}, ${sourceSizes}`, baseWidthSize)
}

type Dimensions = {
  width: number
  height: number
}

const ImageComponent = forwardRef(function Image(
  {
    id,
    width,
    margin,
    padding,
    file,
    border,
    borderRadius,
    altText,
    link,
    opacity,
    boxShadow,
    placeholder = placeholders.image,
    className,
    priority,
  }: Props,
  ref: Ref<HTMLAnchorElement & HTMLDivElement>,
) {
  const fileId = match(file)
    .with(P.string, v => v)
    .with({ type: 'makeswift-file', version: 1 }, v => v.id)
    .otherwise(() => null)
  const fileData = useFile(fileId)
  const imageSrc = match([file, fileData])
    .with([P.any, P.not(P.nullish)], ([, fileData]) => fileData.publicUrl)
    .with([{ type: 'external-file', version: 1 }, P.any], ([file]) => file.url)
    .otherwise(() => placeholder.src)
  const dataDimensions = match([file, fileData, imageSrc])
    .with(
      [{ type: 'external-file', version: 1, width: P.number, height: P.number }, P.any, P.any],
      ([externalFile]) => ({ width: externalFile.width, height: externalFile.height }),
    )
    .with([P.any, P.not(P.nullish), P.any], ([, data]) => data.dimensions)
    .with([P.any, P.any, placeholder.src], () => placeholder.dimensions)
    .otherwise(() => null)
  const [measuredDimensions, setMeasuredDimensions] = useState<Dimensions | null>(null)
  const breakpoints = useBreakpoints()

  useEffect(() => {
    if (dataDimensions) return

    let cleanedUp = false

    loadImage(imageSrc)
      .then(image => {
        if (!cleanedUp) {
          setMeasuredDimensions({ width: image.naturalWidth, height: image.naturalHeight })
        }
      })
      .catch(console.error)

    return () => {
      cleanedUp = true
    }
  }, [dataDimensions, imageSrc])

  const dimensions = dataDimensions ?? measuredDimensions
  const Container = link ? Link : 'div'
  const containerClassName = cx(
    useStyle({ lineHeight: 0, overflow: 'hidden' }),
    useStyle(useResponsiveWidth(width, dimensions?.width)),
    useStyle(useResponsiveStyle([opacity] as const, ([opacity = 1]) => ({ opacity }))),
    margin,
    padding,
    border,
    borderRadius,
    boxShadow,
    className,
  )

  const { Image } = useFrameworkContext()

  if (!dimensions) return null

  return (
    <Container link={link} ref={ref} id={id} className={containerClassName}>
      <Image
        src={imageSrc}
        priority={priority}
        sizes={imageSizes(breakpoints, width)}
        alt={altText ?? fileData?.description ?? ''}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </Container>
  )
})

export default ImageComponent

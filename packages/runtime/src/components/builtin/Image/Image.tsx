import { useState, useEffect, Ref, forwardRef } from 'react'
import NextImage from 'next/image'
import type NextLegacyImageType from 'next/legacy/image'

import {
  ElementIDValue,
  ImageValue,
  LinkValue,
  ResponsiveOpacityValue,
  TextInputValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { DEVICES, findDeviceOverride } from '../../utils/devices'
import { placeholders } from '../../utils/placeholders'
import { useIsInBuilder } from '../../../runtimes/react'
import { Link } from '../../shared/Link'
import { cx } from '@emotion/css'
import { useStyle } from '../../../runtimes/react/use-style'
import { responsiveStyle, responsiveWidth } from '../../utils/responsive-style'
import { useFile } from '../../../runtimes/react/hooks/makeswift-api'
import { major as nextMajorVersion } from '../../../next/next-version'

const NextLegacyImage = NextImage as typeof NextLegacyImageType

type Props = {
  id?: ElementIDValue
  file?: ImageValue
  altText?: TextInputValue
  link?: LinkValue
  width?: WidthValue
  margin?: string
  padding?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  opacity?: ResponsiveOpacityValue
  placeholder?: { src: string; dimensions: { width: number; height: number } }
  className?: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function imageSizes(width?: Props['width']): string {
  const baseDevice = DEVICES.find(device => device.maxWidth == null)
  const baseWidth = baseDevice && width && findDeviceOverride(width, baseDevice.id)
  const baseWidthSize =
    baseWidth == null || baseWidth.value.unit !== 'px' ? '100vw' : `${baseWidth.value.value}px`

  return DEVICES.map(device => {
    const override = findDeviceOverride(width, device.id)

    if (override == null || device.maxWidth == null || override.value.unit !== 'px') return null

    return `(max-width: ${device.maxWidth}px) ${Math.min(device.maxWidth, override.value.value)}px`
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
  }: Props,
  ref: Ref<HTMLAnchorElement & HTMLDivElement>,
) {
  const fileData = useFile(file ?? null)
  const imageSrc = fileData?.publicUrl ? fileData.publicUrl : placeholder.src
  const dataDimensions = fileData?.publicUrl ? fileData?.dimensions : placeholder.dimensions
  const [measuredDimensions, setMeasuredDimensions] = useState<Dimensions | null>(null)
  const isInBuilder = useIsInBuilder()

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
    useStyle(responsiveWidth(width, dimensions?.width)),
    useStyle(responsiveStyle([opacity] as const, ([opacity = 1]) => ({ opacity }))),
    margin,
    padding,
    border,
    borderRadius,
    boxShadow,
    className,
  )

  if (!dimensions) return null

  return (
    <Container link={link} ref={ref} id={id} className={containerClassName}>
      {nextMajorVersion < 13 ? (
        <NextLegacyImage
          layout="responsive"
          src={imageSrc}
          sizes={imageSizes(width)}
          alt={altText}
          width={dimensions.width}
          height={dimensions.height}
          unoptimized={isInBuilder}
        />
      ) : (
        <NextImage
          src={imageSrc}
          sizes={imageSizes(width)}
          alt={altText ?? ''}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            width: '100%',
            height: 'auto',
          }}
          unoptimized={isInBuilder}
        />
      )}
    </Container>
  )
})

export default ImageComponent

import styled, { css } from 'styled-components'
import { useState, useEffect, Ref, forwardRef } from 'react'
import NextImage from 'next/image'
import { css as toClass, cx } from '@emotion/css'

import {
  BorderRadiusValue,
  BorderValue,
  ElementIDValue,
  ImageValue,
  LinkValue,
  MarginValue,
  PaddingValue,
  ResponsiveOpacityValue,
  ShadowsValue,
  TextInputValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import {
  cssBorder,
  cssBorderRadius,
  cssBoxShadow,
  cssMargin,
  cssMediaRules,
  cssPadding,
} from '../../utils/cssMediaRules'
import { DEVICES, findDeviceOverride } from '../../utils/devices'
import {
  BorderPropControllerData,
  BoxShadowPropControllerData,
  useBorder,
  useBoxShadow,
  useFile,
} from '../../hooks'
import { placeholders } from '../../utils/placeholders'
import { ReactRuntime, useIsInBuilder } from '../../../react'
import { Link } from '../../shared/Link'
import { Props } from '../../../prop-controllers'
import { responsiveWidth } from '../../utils/responsive-style'

type Props = {
  id?: ElementIDValue
  file?: ImageValue
  altText?: TextInputValue
  link?: LinkValue
  width?: WidthValue
  margin?: MarginValue
  padding?: PaddingValue
  border?: BorderValue
  borderRadius?: BorderRadiusValue
  boxShadow?: ShadowsValue
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

const ImageContainer = styled.div.withConfig({
  shouldForwardProp: prop =>
    ![
      'margin',
      'padding',
      'border',
      'borderRadius',
      'boxShadow',
      'opacity',
      'link',
      'dimensions',
    ].includes(prop.toString()),
})<{
  margin?: Props['margin']
  padding?: Props['padding']
  border?: BorderPropControllerData | null | undefined
  borderRadius: Props['borderRadius']
  boxShadow?: BoxShadowPropControllerData | null | undefined
  opacity: Props['opacity']
  link?: Props['link']
}>`
  line-height: 0;
  overflow: hidden;
  ${cssMargin()}
  ${cssPadding()}
  ${cssBorder()}
  ${cssBorderRadius()}
  ${cssBoxShadow()}
  ${p =>
    cssMediaRules(
      [p.opacity],
      ([opacity = 1]) => css`
        opacity: ${opacity};
      `,
    )}
`

const UnoptimizedImage = styled.img`
  width: 100%;
`

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
  ref: Ref<HTMLImageElement>,
) {
  const fileData = useFile(file)
  const borderData = useBorder(border)
  const boxShadowData = useBoxShadow(boxShadow)
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

  if (!dimensions) return null

  const widthClass = toClass(responsiveWidth(width, `${dimensions.width}px`))

  return (
    <ImageContainer
      as={link ? Link : 'div'}
      link={link}
      ref={ref}
      id={id}
      className={cx(className, widthClass)}
      margin={margin}
      opacity={opacity}
      padding={padding}
      border={borderData}
      borderRadius={borderRadius}
      boxShadow={boxShadowData}
    >
      {isInBuilder ? (
        <UnoptimizedImage src={imageSrc} alt={altText} />
      ) : (
        <NextImage
          layout="responsive"
          src={imageSrc}
          sizes={imageSizes(width)}
          alt={altText}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </ImageContainer>
  )
})

export default ImageComponent

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(ImageComponent, {
    type: './components/Image/index.js',
    label: 'Image',
    props: {
      id: Props.ElementID(),
      file: Props.Image(),
      altText: Props.TextInput({ label: 'Alt text' }),
      link: Props.Link({ label: 'On click' }),
      width: Props.Width(),
      margin: Props.Margin(),
      padding: Props.Padding(),
      border: Props.Border(),
      borderRadius: Props.BorderRadius(),
      boxShadow: Props.Shadows(),
      opacity: Props.ResponsiveOpacity(),
    },
  })
}

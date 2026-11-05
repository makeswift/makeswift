import { type CSSObject } from '@emotion/serialize'
import { type BackgroundData, type ResponsiveBackgroundsData } from '@makeswift/prop-controllers'

import { useBackgrounds, type BackgroundsData } from '../../hooks'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { getColor, getStopsStyle } from '../../shared/BackgroundsContainer/components/Backgrounds'
import { useBaseStyles } from '../../../runtimes/react/css-runtime/hooks/use-base-styles'

const DEFAULT_PAGE_BACKGROUND_COLOR = 'white'

/**
 * Whether a background layer can be faithfully expressed with CSS backgrounds on the `html`
 * element. Videos, parallax and translucent images can't, so those stay in the page root.
 */
function isHtmlBackground(background: BackgroundData): boolean {
  switch (background.type) {
    case 'color':
    case 'gradient':
      return true

    case 'image':
    case 'image-v1': {
      const { opacity, parallax } = background.payload
      return (opacity == null || opacity === 1) && !parallax
    }

    case 'video':
      return false
  }
}

function filterBackgrounds(
  backgrounds: ResponsiveBackgroundsData | undefined,
  predicate: (background: BackgroundData) => boolean,
): ResponsiveBackgroundsData | undefined {
  const filtered = backgrounds?.map(({ value, ...rest }) => ({
    ...rest,
    value: value.filter(predicate),
  }))

  return filtered?.some(({ value }) => value.length > 0) ? filtered : undefined
}

function toHtmlBackgroundStyle(layers: BackgroundsData = []): CSSObject {
  const images: string[] = []
  const positions: string[] = []
  const sizes: string[] = []
  const repeats: string[] = []

  // CSS paints the first background layer on top, matching the order of the layers data
  layers.forEach(layer => {
    if (layer.type === 'color') {
      const color = getColor(layer.payload)
      images.push(`linear-gradient(${color}, ${color})`)
      positions.push('0% 0%')
      sizes.push('auto')
      // a repeated solid color fills the whole canvas, not just the `html` element's box
      repeats.push('repeat')
    } else if (layer.type === 'gradient' && layer.payload) {
      const { stops, angle = Math.PI, isRadial = false } = layer.payload
      const gradient = getStopsStyle(stops)
      images.push(
        isRadial ? `radial-gradient(${gradient})` : `linear-gradient(${angle}rad, ${gradient})`,
      )
      positions.push('0% 0%')
      sizes.push('auto')
      repeats.push('no-repeat')
    } else if (layer.type === 'image' && layer.payload?.publicUrl != null) {
      const { publicUrl, position, size = 'cover', repeat = 'no-repeat' } = layer.payload
      images.push(`url('${publicUrl}')`)
      positions.push(`${position.x}% ${position.y}%`)
      sizes.push(size)
      repeats.push(repeat)
    }
  })

  return {
    backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
    backgroundImage: images.length > 0 ? images.join(',') : 'none',
    backgroundPosition: positions.length > 0 ? positions.join(',') : '0% 0%',
    backgroundSize: sizes.length > 0 ? sizes.join(',') : 'auto',
    backgroundRepeat: repeats.length > 0 ? repeats.join(',') : 'repeat',
  }
}

/**
 * Assigns the page's backgrounds to the `html` element, so that they cover the entire viewport
 * regardless of how tall the page's contents are.
 *
 * Returns the backgrounds that can't be rendered by the `html` element, which should be rendered
 * by the page root as usual.
 */
export function usePageBackgrounds(backgrounds: ResponsiveBackgroundsData | undefined) {
  const htmlBackgrounds = useBackgrounds(filterBackgrounds(backgrounds, isHtmlBackground))
  const htmlBackgroundStyle = useResponsiveStyle([htmlBackgrounds], ([layers]) =>
    toHtmlBackgroundStyle(layers),
  )
  const { styleElement } = useBaseStyles({
    styles: {
      html: { ...toHtmlBackgroundStyle(), ...htmlBackgroundStyle },
    },
  })

  return {
    styleElement,
    rootBackgrounds: filterBackgrounds(backgrounds, background => !isHtmlBackground(background)),
  }
}

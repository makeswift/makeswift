import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'

import { Link } from '../../shared/Link'
import { colorToString } from '../../utils/colorToString'
import { ColorValue as Color } from '../../utils/types'
import { SocialLinksOptions, SocialLinksOptionType } from './options'
import GutterContainer from '../../shared/GutterContainer'
import SocialLinksPlaceholder from './components/SocialLinksPlaceholder'
import {
  ResponsiveValue,
  ElementIDValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveSelectValue,
  GapXValue,
} from '../../../prop-controllers/descriptors'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { cx } from '@emotion/css'
import { useStyle } from '../../../runtimes/react/use-style'
import { useResponsiveStyle } from '../../utils/responsive-style'

type Props = {
  id?: ElementIDValue
  links?: {
    links: { id: string; payload: { type: SocialLinksOptionType; url: string } }[]
    openInNewTab: boolean
  }
  shape?: ResponsiveIconRadioGroupValue<'naked' | 'circle' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  hoverStyle?: ResponsiveSelectValue<'none' | 'grow' | 'shrink' | 'fade'>
  fill?: ResponsiveColor | null
  backgroundColor?: ResponsiveColor | null
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: GapXValue
  width?: string
  margin?: string
}

const SocialLinks = forwardRef(function SocialLinks(
  {
    id,
    links: { links, openInNewTab } = { links: [], openInNewTab: false },
    shape,
    size,
    hoverStyle,
    fill,
    backgroundColor,
    alignment,
    gutter,
    width,
    margin,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        useStyle({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }),
        width,
        margin,
        useStyle(
          useResponsiveStyle([alignment] as const, ([alignment = 'center']) => ({
            justifyContent: alignment,
          })),
        ),
      )}
    >
      {links.length > 0 ? (
        links.map((link, i) => {
          const option = SocialLinksOptions.find(o => o.type === link.payload.type)

          if (!option) throw new Error(`Invalid link payload type ${link.payload.type}`)

          return (
            <GutterContainer
              key={link.id}
              gutter={gutter}
              first={i === 0}
              last={i === links.length - 1}
            >
              <StyledLink
                backgroundColor={backgroundColor}
                brandColor={option.brandColor}
                fill={fill}
                hoverStyle={hoverStyle}
                link={{ type: 'OPEN_URL', payload: { url: link.payload.url, openInNewTab } }}
                shape={shape}
                size={size}
              >
                {option == null ? null : option.icon}
              </StyledLink>
            </GutterContainer>
          )
        })
      ) : (
        <SocialLinksPlaceholder gutter={gutter} />
      )}
    </div>
  )
})

export default SocialLinks

type StyledLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  brandColor: string
  shape: Props['shape']
  size: Props['size']
  hoverStyle: Props['hoverStyle']
  fill: ResponsiveValue<Color> | null | undefined
  backgroundColor: ResponsiveValue<Color> | null | undefined
}

function StyledLink({
  className,
  brandColor,
  shape,
  size,
  hoverStyle,
  fill,
  backgroundColor,
  ...restOfProps
}: StyledLinkProps) {
  return (
    <Link
      {...restOfProps}
      className={cx(
        useStyle({
          display: 'block',
          color: brandColor,
          transition: 'transform, opacity 0.18s',
          svg: { display: 'block' },
        }),
        useStyle(
          useResponsiveStyle(
            [shape, size, hoverStyle, fill, backgroundColor] as const,
            ([shape = 'naked', size = 'medium', hoverStyle = 'none', fill, backgroundColor]) => ({
              padding: shape === 'naked' ? 0 : { small: 10, medium: 12, large: 14 }[size],
              borderRadius: { circle: '50%', rounded: '8px', naked: 0, square: 0 }[shape],
              background:
                shape === 'naked'
                  ? 'transparent'
                  : backgroundColor == null
                  ? 'currentColor'
                  : colorToString(backgroundColor),

              ':hover': {
                none: {},
                grow: { transform: 'scale(1.1)' },
                shrink: { transform: 'scale(0.9)' },
                fade: { opacity: 0.65 },
              }[hoverStyle],

              svg: {
                fill:
                  fill == null
                    ? shape === 'naked' || backgroundColor != null
                      ? 'currentColor'
                      : 'white'
                    : colorToString(fill),
                width: { small: 16, medium: 20, large: 24 }[size],
                height: { small: 16, medium: 20, large: 24 }[size],
              },
            }),
          ),
        ),
        className,
      )}
    />
  )
}

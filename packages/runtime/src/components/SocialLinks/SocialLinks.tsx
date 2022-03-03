import { forwardRef, Ref } from 'react'
import styled, { css } from 'styled-components'

import { Link } from '../Link'
import { cssMediaRules, cssWidth, cssMargin } from '../utils/cssMediaRules'
import { colorToString } from '../utils/colorToString'
import { ColorValue as Color } from '../utils/types'
import { useColor } from '../hooks'
import { SocialLinksOptions } from './options'
import GutterContainer from '../shared/GutterContainer'
import SocialLinksPlaceholder from './components/SocialLinksPlaceholder'
import {
  ResponsiveValue,
  ElementIDValue,
  SocialLinksValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveSelectValue,
  ResponsiveColorValue,
  GapXValue,
  WidthValue,
  MarginValue,
} from '../../prop-controllers/descriptors'

type Props = {
  id?: ElementIDValue
  links?: SocialLinksValue
  shape?: ResponsiveIconRadioGroupValue<'naked' | 'circle' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  hoverStyle?: ResponsiveSelectValue<'none' | 'grow' | 'shrink' | 'fade'>
  fill?: ResponsiveColorValue
  backgroundColor?: ResponsiveColorValue
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: GapXValue
  width?: WidthValue
  margin?: MarginValue
}

const Container = styled.div<{
  width: Props['width']
  margin: Props['margin']
  alignment: Props['alignment']
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${cssWidth()}
  ${cssMargin()}
  ${p =>
    cssMediaRules(
      [p.alignment] as const,
      ([alignment = 'center']) => css`
        justify-content: ${alignment};
      `,
    )}
`

const StyledLink = styled(Link)<{
  brandColor: string
  shape: Props['shape']
  size: Props['size']
  hoverStyle: Props['hoverStyle']
  fill: ResponsiveValue<Color> | null | undefined
  backgroundColor: ResponsiveValue<Color> | null | undefined
}>`
  display: block;
  color: ${props => props.brandColor};
  transition: transform, opacity 0.18s;

  svg {
    display: block;
  }

  ${p =>
    cssMediaRules(
      [p.shape, p.size, p.hoverStyle, p.fill, p.backgroundColor] as const,
      ([shape = 'naked', size = 'medium', hoverStyle = 'none', fill, backgroundColor]) => css`
        padding: ${shape === 'naked' ? 0 : { small: 10, medium: 12, large: 14 }[size]}px;
        border-radius: ${{ circle: '50%', rounded: '8px', naked: 0, square: 0 }[shape]};
        background: ${shape === 'naked'
          ? 'transparent'
          : backgroundColor == null
          ? 'currentColor'
          : colorToString(backgroundColor)};

        :hover {
          ${{
            none: '',
            grow: css`
              transform: scale(1.1);
            `,
            shrink: css`
              transform: scale(0.9);
            `,
            fade: css`
              opacity: 0.65;
            `,
          }[hoverStyle]}
        }

        svg {
          fill: ${fill == null
            ? shape === 'naked' || backgroundColor != null
              ? 'currentColor'
              : 'white'
            : colorToString(fill)};
          width: ${{ small: 16, medium: 20, large: 24 }[size]}px;
          height: ${{ small: 16, medium: 20, large: 24 }[size]}px;
        }
      `,
    )}
`

export default forwardRef(function SocialLinks(
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
  const fillData = useColor(fill)
  const backgroundColorData = useColor(backgroundColor)

  return (
    <Container ref={ref} id={id} alignment={alignment} width={width} margin={margin}>
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
                backgroundColor={backgroundColorData}
                brandColor={option.brandColor}
                fill={fillData}
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
    </Container>
  )
})

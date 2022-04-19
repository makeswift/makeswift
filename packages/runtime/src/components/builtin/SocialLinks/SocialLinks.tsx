import { forwardRef, Ref } from 'react'
import styled, { css } from 'styled-components'
import { cx } from '@emotion/css'

import { Link } from '../../shared/Link'
import { cssMediaRules, cssMargin } from '../../utils/cssMediaRules'
import { colorToString } from '../../utils/colorToString'
import { ColorValue as Color } from '../../utils/types'
import { SocialLinksOptions } from './options'
import GutterContainer from '../../shared/GutterContainer'
import SocialLinksPlaceholder from './components/SocialLinksPlaceholder'
import {
  ResponsiveValue,
  ElementIDValue,
  SocialLinksValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveSelectValue,
  GapXValue,
  MarginValue,
} from '../../../prop-controllers/descriptors'
import { ReactRuntime } from '../../../react'
import { Props } from '../../../prop-controllers'
import { ResponsiveColor } from '../../../runtimes/react/controls'

type Props = {
  id?: ElementIDValue
  links?: SocialLinksValue
  shape?: ResponsiveIconRadioGroupValue<'naked' | 'circle' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  hoverStyle?: ResponsiveSelectValue<'none' | 'grow' | 'shrink' | 'fade'>
  fill?: ResponsiveColor
  backgroundColor?: ResponsiveColor
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: GapXValue
  width?: string
  margin?: MarginValue
}

const Container = styled.div<{
  margin: Props['margin']
  alignment: Props['alignment']
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
    <Container ref={ref} id={id} className={cx(width)} alignment={alignment} margin={margin}>
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
    </Container>
  )
})

export default SocialLinks

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(SocialLinks, {
    type: './components/SocialLinks/index.js',
    label: 'Social Links',
    icon: 'SocialLinks40',
    props: {
      id: Props.ElementID(),
      links: Props.SocialLinks({
        preset: {
          links: [
            {
              id: 'facebook',
              payload: { type: 'facebook', url: 'https://www.facebook.com' },
            },
            {
              id: 'instagram',
              payload: { type: 'instagram', url: 'https://www.instagram.com' },
            },
            {
              id: 'twitter',
              payload: { type: 'twitter', url: 'https://www.twitter.com' },
            },
          ],
          openInNewTab: false,
        },
      }),
      shape: Props.ResponsiveIconRadioGroup({
        label: 'Shape',
        options: [
          { label: 'Naked', value: 'naked', icon: 'Star16' },
          { label: 'Circle', value: 'circle', icon: 'StarCircle16' },
          { label: 'Rounded', value: 'rounded', icon: 'StarRoundedSquare16' },
          { label: 'Square', value: 'square', icon: 'StarSquare16' },
        ],
        defaultValue: 'naked',
        // hidden: links == null || links.links.length === 0,
      }),
      size: Props.ResponsiveIconRadioGroup({
        label: 'Size',
        options: [
          { label: 'Small', value: 'small', icon: 'SizeSmall16' },
          { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
          { label: 'Large', value: 'large', icon: 'SizeLarge16' },
        ],
        defaultValue: 'medium',
        // hidden: links == null || links.links.length === 0,
      }),
      hoverStyle: Props.ResponsiveSelect({
        label: 'On hover',
        options: [
          { value: 'none', label: 'None' },
          { value: 'grow', label: 'Grow' },
          { value: 'shrink', label: 'Shrink' },
          { value: 'fade', label: 'Fade' },
        ],
        defaultValue: 'none',
        labelOrientation: 'horizontal',
        // hidden: links == null || links.links.length === 0,
      }),
      fill: Props.ResponsiveColor({
        label: 'Icon color',
        // hidden: links == null || links.links.length === 0,
      }),
      backgroundColor: Props.ResponsiveColor({
        label: 'Shape color',
        // hidden: links == null || links.links.length === 0,
      }),
      alignment: Props.ResponsiveIconRadioGroup({
        label: 'Alignment',
        options: [
          { label: 'flex-start', value: 'flex-start', icon: 'AlignLeft16' },
          { label: 'center', value: 'center', icon: 'AlignCenter16' },
          { label: 'flex-end', value: 'flex-end', icon: 'AlignRight16' },
        ],
        defaultValue: 'center',
      }),
      gutter: Props.GapX({
        preset: [{ deviceId: 'desktop', value: { value: 10, unit: 'px' } }],
        label: 'Link gap',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: { value: 0, unit: 'px' },
      }),
      width: Props.Width({
        format: Props.Width.Formats.ClassName,
        defaultValue: { value: 100, unit: '%' },
      }),
      margin: Props.Margin({
        preset: [
          {
            deviceId: 'desktop',
            value: {
              marginTop: { value: 10, unit: 'px' },
              marginRight: 'auto',
              marginBottom: { value: 10, unit: 'px' },
              marginLeft: 'auto',
            },
          },
        ],
      }),
    },
  })
}

import { type ReactRuntimeCore } from '../../../runtimes/react'
import { getBaseBreakpoint } from '@makeswift/controls'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import {
  ElementID,
  GapX,
  Margin,
  ResponsiveColor,
  ResponsiveSelect,
  ResponsiveIconRadioGroup,
  SocialLinks,
  SocialLinksPropControllerData,
  Width,
  getSocialLinksPropControllerDataSocialLinksData,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntimeCore) {
  return runtime.registerComponent(
    lazy(() => import('./SocialLinks')),
    {
      type: MakeswiftComponentType.SocialLinks,
      label: 'Social Links',
      icon: ComponentIcon.SocialLinks,
      props: {
        id: ElementID(),
        links: SocialLinks({
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
        shape: ResponsiveIconRadioGroup(props => {
          const links = getSocialLinksPropControllerDataSocialLinksData(
            props.links as SocialLinksPropControllerData | undefined,
          )

          return {
            label: 'Shape',
            options: [
              { label: 'Naked', value: 'naked', icon: 'Star16' },
              { label: 'Circle', value: 'circle', icon: 'StarCircle16' },
              { label: 'Rounded', value: 'rounded', icon: 'StarRoundedSquare16' },
              { label: 'Square', value: 'square', icon: 'StarSquare16' },
            ],
            defaultValue: 'naked',
            hidden: links == null || links.links.length === 0,
          }
        }),
        size: ResponsiveIconRadioGroup(props => {
          const links = getSocialLinksPropControllerDataSocialLinksData(
            props.links as SocialLinksPropControllerData | undefined,
          )

          return {
            label: 'Size',
            options: [
              { label: 'Small', value: 'small', icon: 'SizeSmall16' },
              { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
              { label: 'Large', value: 'large', icon: 'SizeLarge16' },
            ],
            defaultValue: 'medium',
            hidden: links == null || links.links.length === 0,
          }
        }),
        hoverStyle: ResponsiveSelect(props => {
          const links = getSocialLinksPropControllerDataSocialLinksData(
            props.links as SocialLinksPropControllerData | undefined,
          )
          const hidden = links == null || links.links.length === 0

          return {
            label: 'On hover',
            options: [
              { value: 'none', label: 'None' },
              { value: 'grow', label: 'Grow' },
              { value: 'shrink', label: 'Shrink' },
              { value: 'fade', label: 'Fade' },
            ],
            defaultValue: 'none',
            labelOrientation: 'horizontal',
            hidden,
          }
        }),
        fill: ResponsiveColor(props => {
          const links = getSocialLinksPropControllerDataSocialLinksData(
            props.links as SocialLinksPropControllerData | undefined,
          )
          const hidden = links == null || links.links.length === 0

          return {
            label: 'Icon color',
            hidden,
          }
        }),
        backgroundColor: ResponsiveColor(props => {
          const links = getSocialLinksPropControllerDataSocialLinksData(
            props.links as SocialLinksPropControllerData | undefined,
          )
          const hidden = links == null || links.links.length === 0

          return {
            label: 'Shape color',
            hidden,
          }
        }),
        alignment: ResponsiveIconRadioGroup({
          label: 'Alignment',
          options: [
            { label: 'flex-start', value: 'flex-start', icon: 'AlignLeft16' },
            { label: 'center', value: 'center', icon: 'AlignCenter16' },
            { label: 'flex-end', value: 'flex-end', icon: 'AlignRight16' },
          ],
          defaultValue: 'center',
        }),
        gutter: GapX({
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 10, unit: 'px' },
            },
          ],
          label: 'Link gap',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: { value: 0, unit: 'px' },
        }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Margin({
          format: Margin.Format.ClassName,
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
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
    },
  )
}

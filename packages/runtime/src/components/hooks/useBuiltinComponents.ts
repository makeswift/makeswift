import { useEffect } from 'react'
import uuid from 'uuid/v4'

import {
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_ITEM_ANIMATE_DELAY,
  DEFAULT_ITEM_STAGGER_DURATION,
  Box,
  Image,
  Carousel,
  Countdown,
  Embed,
  Divider,
  Button,
  Navigation,
  SocialLinks,
  Root,
} from '../builtin'

import { Props } from '../../prop-controllers'
import { ReactRuntime } from '../../react'
import { Store } from '../../state/react-page'

export function useBuiltinComponents(store: Store) {
  useEffect(() => {
    const unregisterRoot = ReactRuntime.registerComponent(
      Root,
      {
        type: './components/Root/index.js',
        label: 'Page',
        hidden: true,
        props: {
          children: Props.Grid(),
          backgrounds: Props.Backgrounds(),
          rowGap: Props.GapY(),
          columnGap: Props.GapX(),
        },
      },
      store,
    )

    const unregisterBox = ReactRuntime.registerComponent(
      Box,
      {
        type: './components/Box/index.js',
        label: 'Box',
        props: {
          id: Props.ElementID(),
          backgrounds: Props.Backgrounds(),
          width: Props.Width(),
          height: Props.ResponsiveIconRadioGroup({
            label: 'Height',
            options: [
              { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
              { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
            ],
            defaultValue: 'auto',
          }),
          verticalAlign: Props.ResponsiveIconRadioGroup({
            label: 'Align items',
            options: [
              { value: 'flex-start', label: 'Top', icon: 'VerticalAlignStart16' },
              { value: 'center', label: 'Middle', icon: 'VerticalAlignMiddle16' },
              { value: 'flex-end', label: 'Bottom', icon: 'VerticalAlignEnd16' },
              {
                value: 'space-between',
                label: 'Space between',
                icon: 'VerticalAlignSpaceBetween16',
              },
            ],
            defaultValue: 'flex-start',
          }),
          margin: Props.Margin(),
          padding: Props.Padding({
            preset: [
              {
                deviceId: 'desktop',
                value: {
                  paddingTop: { value: 10, unit: 'px' },
                  paddingRight: { value: 10, unit: 'px' },
                  paddingBottom: { value: 10, unit: 'px' },
                  paddingLeft: { value: 10, unit: 'px' },
                },
              },
            ],
          }),
          border: Props.Border(),
          borderRadius: Props.BorderRadius(),
          boxShadow: Props.Shadows(),
          rowGap: Props.GapY({
            // hidden: props.children == null,
          }),
          columnGap: Props.GapX({
            // hidden: props.children == null,
          }),
          boxAnimateType: Props.ResponsiveSelect({
            label: 'Animate box in',
            labelOrientation: 'vertical',
            options: [
              { value: 'none', label: 'None' },
              { value: 'fadeIn', label: 'Fade in' },
              { value: 'fadeRight', label: 'Fade right' },
              { value: 'fadeDown', label: 'Fade down' },
              { value: 'fadeLeft', label: 'Fade left' },
              { value: 'fadeUp', label: 'Fade up' },
              { value: 'blurIn', label: 'Blur in' },
              { value: 'scaleUp', label: 'Scale up' },
              { value: 'scaleDown', label: 'Scale down' },
            ],
            defaultValue: 'none',
          }),
          boxAnimateDuration: Props.ResponsiveNumber({
            label: 'Box duration',
            defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
            min: 0.1,
            step: 0.05,
            suffix: 's',
            // hidden: isHiddenBasedOnBoxAnimation(props, device),
          }),
          boxAnimateDelay: Props.ResponsiveNumber({
            label: 'Box delay',
            defaultValue: DEFAULT_BOX_ANIMATE_DELAY,
            min: 0,
            step: 0.05,
            suffix: 's',
            // hidden: isHiddenBasedOnBoxAnimation(props, device),
          }),
          itemAnimateType: Props.ResponsiveSelect({
            label: 'Animate items in',
            labelOrientation: 'vertical',
            options: [
              { value: 'none', label: 'None' },
              { value: 'fadeIn', label: 'Fade in' },
              { value: 'fadeRight', label: 'Fade right' },
              { value: 'fadeDown', label: 'Fade down' },
              { value: 'fadeLeft', label: 'Fade left' },
              { value: 'fadeUp', label: 'Fade up' },
              { value: 'blurIn', label: 'Blur in' },
              { value: 'scaleUp', label: 'Scale up' },
              { value: 'scaleDown', label: 'Scale down' },
            ],
            defaultValue: 'none',
          }),
          itemAnimateDuration: Props.ResponsiveNumber({
            label: 'Items duration',
            defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
            min: 0.1,
            step: 0.05,
            suffix: 's',
            // hidden: isHiddenBasedOnItemAnimation(props, device),
          }),
          itemAnimateDelay: Props.ResponsiveNumber({
            label: 'Items delay',
            defaultValue: DEFAULT_ITEM_ANIMATE_DELAY,
            min: 0,
            step: 0.05,
            suffix: 's',
            // hidden: isHiddenBasedOnItemAnimation(props, device),
          }),
          itemStaggerDuration: Props.ResponsiveNumber({
            label: 'Stagger',
            min: 0,
            step: 0.05,
            suffix: 's',
            defaultValue: DEFAULT_ITEM_STAGGER_DURATION,
            // hidden: isHiddenBasedOnItemAnimation(props, device),
          }),
          hidePlaceholder: Props.Checkbox({
            label: 'Hide placeholder',
            // hidden: props.children != null,
          }),
          children: Props.Grid(),
        },
      },
      store,
    )

    const unregisterImage = ReactRuntime.registerComponent(
      Image,
      {
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
      },
      store,
    )

    const unregisterCarousel = ReactRuntime.registerComponent(
      Carousel,
      {
        type: './components/Carousel/index.js',
        label: 'Carousel',
        icon: 'Carousel40',
        props: {
          id: Props.ElementID(),
          images: Props.Images({
            preset: [
              { key: uuid(), props: {} },
              { key: uuid(), props: {} },
              { key: uuid(), props: {} },
            ],
          }),
          width: Props.Width({ defaultValue: { value: 400, unit: 'px' } }),
          margin: Props.Margin(),
          pageSize: Props.ResponsiveNumber({
            label: 'Images shown',
            defaultValue: 1,
            min: 1,
            // max: images?.length ?? 0,
            step: 1,
          }),
          step: Props.ResponsiveNumber({
            label: 'Step',
            defaultValue: 1,
            min: 1,
            // max: findDeviceOverride(pageSize, device)?.value ?? 1,
            step: 1,
          }),
          slideAlignment: Props.ResponsiveIconRadioGroup({
            label: 'Alignment',
            options: [
              { label: 'Top', value: 'flex-start', icon: 'VerticalAlignStart16' },
              { label: 'Middle', value: 'center', icon: 'VerticalAlignMiddle16' },
              { label: 'Bottom', value: 'flex-end', icon: 'VerticalAlignEnd16' },
            ],
            defaultValue: 'center',
          }),
          gap: Props.GapX({
            label: 'Gap',
            step: 5,
            defaultValue: { value: 0, unit: 'px' },
          }),
          autoplay: Props.Checkbox({ label: 'Autoplay' }),
          delay: Props.Number({
            label: 'Delay',
            preset: 5,
            min: 1,
            step: 0.1,
            suffix: 'seconds',
            // hidden: !props.autoplay,
          }),
          showArrows: Props.Checkbox({ preset: true, label: 'Show arrows' }),
          arrowPosition: Props.ResponsiveIconRadioGroup({
            label: 'Arrow position',
            options: [
              { label: 'Inside', value: 'inside', icon: 'ArrowInside16' },
              { label: 'Center', value: 'center', icon: 'ArrowCenter16' },
              { label: 'Outside', value: 'outside', icon: 'ArrowOutside16' },
            ],
            defaultValue: 'inside',
            // hidden: props.showArrows === false,
          }),
          arrowColor: Props.ResponsiveColor({
            label: 'Arrow color',
            placeholder: 'black',
            // hidden: props.showArrows === false,
          }),
          arrowBackground: Props.ResponsiveColor({
            label: 'Arrow background',
            placeholder: 'white',
            // hidden: props.showArrows === false,
          }),
          showDots: Props.Checkbox({ preset: true, label: 'Show dots' }),
          dotColor: Props.ResponsiveColor({
            label: 'Dot color',
            placeholder: 'black',
            // hidden: props.showDots === false,
          }),
          slideBorder: Props.Border(),
          slideBorderRadius: Props.BorderRadius(),
        },
      },
      store,
    )

    const unregisterCountdown = ReactRuntime.registerComponent(
      Countdown,
      {
        type: './components/Countdown/index.js',
        label: 'Countdown',
        icon: 'Countdown40',
        props: {
          id: Props.ElementID(),
          // TODO: Make this a function
          date: Props.Date({
            preset: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
          }),
          variant: Props.ResponsiveIconRadioGroup({
            label: 'Style',
            options: [
              { label: 'Filled', value: 'filled', icon: 'CountdownSolid16' },
              {
                label: 'Filled split',
                value: 'filled-split',
                icon: 'CountdownSolidSplit16',
              },
              { label: 'Outline', value: 'outline', icon: 'CountdownOutline16' },
              {
                label: 'Outline split',
                value: 'outline-split',
                icon: 'CountdownOutlineSplit16',
              },
              { label: 'Clear', value: 'clear', icon: 'CountdownNaked16' },
            ],
            defaultValue: 'filled',
          }),
          shape: Props.ResponsiveIconRadioGroup({
            label: 'Shape',
            options: [
              { label: 'Pill', value: 'pill', icon: 'ButtonPill16' },
              { label: 'Rounded', value: 'rounded', icon: 'ButtonRounded16' },
              { label: 'Square', value: 'square', icon: 'ButtonSquare16' },
            ],
            defaultValue: 'rounded',
          }),
          size: Props.ResponsiveIconRadioGroup({
            label: 'Size',
            options: [
              { label: 'Small', value: 'small', icon: 'SizeSmall16' },
              { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
              { label: 'Large', value: 'large', icon: 'SizeLarge16' },
            ],
            defaultValue: 'medium',
          }),
          gap: Props.GapX({
            preset: [{ deviceId: 'desktop', value: { value: 10, unit: 'px' } }],
            label: 'Gap',
            step: 1,
            min: 0,
            max: 100,
            defaultValue: { value: 0, unit: 'px' },
          }),
          numberFont: Props.Font({ label: 'Number font' }),
          numberColor: Props.ResponsiveColor({
            label: 'Number color',
            placeholder: 'white',
          }),
          blockColor: Props.ResponsiveColor({
            label: 'Block color',
            placeholder: 'black',
          }),
          labelFont: Props.Font({ label: 'Label font' }),
          labelColor: Props.ResponsiveColor({
            label: 'Label color',
            placeholder: 'black',
          }),
          width: Props.Width({ defaultValue: { value: 560, unit: 'px' } }),
          margin: Props.Margin(),
          daysLabel: Props.TextInput({ label: 'Days label', placeholder: 'Days' }),
          hoursLabel: Props.TextInput({ label: 'Hours label', placeholder: 'Hours' }),
          minutesLabel: Props.TextInput({
            label: 'Minutes label',
            placeholder: 'Minutes',
          }),
          secondsLabel: Props.TextInput({
            label: 'Seconds label',
            placeholder: 'Seconds',
          }),
        },
      },
      store,
    )

    const unregisterDivider = ReactRuntime.registerComponent(
      Divider,
      {
        type: './components/Divider/index.js',
        label: 'Divider',
        icon: 'Divider40',
        props: {
          id: Props.ElementID(),
          variant: Props.ResponsiveSelect({
            label: 'Style',
            labelOrientation: 'horizontal',
            options: [
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'blended', label: 'Blended' },
            ],
            defaultValue: 'solid',
          }),
          thickness: Props.ResponsiveLength({
            label: 'Height',
            defaultValue: { value: 1, unit: 'px' },
            options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
          }),
          color: Props.ResponsiveColor({ placeholder: 'black' }),
          width: Props.Width({ defaultValue: { value: 100, unit: '%' } }),
          margin: Props.Margin(),
        },
      },
      store,
    )

    const unregisterEmbed = ReactRuntime.registerComponent(
      Embed,
      {
        type: './components/Embed/index.js',
        label: 'Embed',
        icon: 'Code40',
        props: {
          id: Props.ElementID(),
          html: Props.TextArea({ label: 'Code', rows: 20 }),
          width: Props.Width(),
          margin: Props.Margin(),
        },
      },
      store,
    )

    const unregisterButton = ReactRuntime.registerComponent(
      Button,
      {
        type: './components/Button/index.js',
        label: 'Button',
        props: {
          id: Props.ElementID(),
          children: Props.TextInput({ placeholder: 'Button text' }),
          link: Props.Link({
            defaultValue: {
              type: 'OPEN_PAGE',
              payload: {
                pageId: null,
                openInNewTab: false,
              },
            },
          }),
          variant: Props.ResponsiveSelect({
            label: 'Style',
            labelOrientation: 'horizontal',
            options: [
              { value: 'flat', label: 'Flat' },
              { value: 'outline', label: 'Outline' },
              { value: 'shadow', label: 'Floating' },
              { value: 'clear', label: 'Clear' },
              { value: 'blocky', label: 'Blocky' },
              { value: 'bubbly', label: 'Bubbly' },
              { value: 'skewed', label: 'Skewed' },
            ],
            defaultValue: 'flat',
          }),
          shape: Props.ResponsiveIconRadioGroup({
            label: 'Shape',
            options: [
              { label: 'Pill', value: 'pill', icon: 'ButtonPill16' },
              { label: 'Rounded', value: 'rounded', icon: 'ButtonRounded16' },
              { label: 'Square', value: 'square', icon: 'ButtonSquare16' },
            ],
            defaultValue: 'rounded',
          }),
          size: Props.ResponsiveIconRadioGroup({
            label: 'Size',
            options: [
              { label: 'Small', value: 'small', icon: 'SizeSmall16' },
              { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
              { label: 'Large', value: 'large', icon: 'SizeLarge16' },
            ],
            defaultValue: 'medium',
          }),
          color: Props.ResponsiveColor({
            placeholder: 'black',
            // hidden: findDeviceOverride<ButtonVariant>(variant, device)?.value === 'clear',
          }),
          textColor: Props.ResponsiveColor({
            label: 'Text color',
            placeholder: 'white',
          }),
          textStyle: Props.TextStyle(),
          width: Props.Width(),
          margin: Props.Margin(),
        },
      },
      store,
    )

    const unregisterNavigation = ReactRuntime.registerComponent(
      Navigation,
      {
        type: './components/Navigation/index.js',
        label: 'Navigation',
        icon: 'Navigation40',
        props: {
          id: Props.ElementID(),
          links: Props.NavigationLinks(),
          linkTextStyle: Props.TextStyle({
            label: 'Link text style',
            // hidden: links == null || links.length === 0,
          }),
          showLogo: Props.Checkbox({ preset: true, label: 'Show logo' }),
          logoFile: Props.Image({
            label: 'Logo',
            // hidden: props.showLogo === false,
          }),
          logoWidth: Props.ResponsiveLength({
            // preset: [{ deviceId: 'desktop', value: { value: 100, unit: 'px' } }],
            label: 'Logo width',
            // min: 0,
            // max: 1000,
            options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
            // hidden: props.showLogo === false,
          }),
          logoAltText: Props.TextInput({
            label: 'Logo alt text',
            // hidden: props.showLogo === false,
          }),
          logoLink: Props.Link({
            label: 'Logo on click',
            // hidden: props.showLogo === false,
          }),
          alignment: Props.ResponsiveIconRadioGroup({
            label: 'Alignment',
            options: [
              { label: 'Left', value: 'flex-start', icon: 'AlignLeft16' },
              { label: 'Center', value: 'center', icon: 'AlignCenter16' },
              { label: 'End', value: 'flex-end', icon: 'AlignRight16' },
            ],
            defaultValue: 'flex-end',
          }),
          gutter: Props.GapX({
            preset: [{ deviceId: 'desktop', value: { value: 10, unit: 'px' } }],
            label: 'Link gap',
            min: 0,
            max: 100,
            step: 1,
            defaultValue: { value: 0, unit: 'px' },
          }),
          mobileMenuAnimation: Props.ResponsiveSelect({
            label: 'Mobile menu',
            options: [
              { value: 'coverRight', label: 'Cover from right' },
              { value: 'coverLeft', label: 'Cover from left' },
            ],
          }),
          mobileMenuOpenIconColor: Props.ResponsiveColor({
            label: 'Open icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            // hidden: !findDeviceOverride(mobileMenuAnimation, device),
          }),
          mobileMenuCloseIconColor: Props.ResponsiveColor({
            label: 'Close icon color',
            placeholder: 'rgba(161, 168, 194, 0.5)',
            // hidden: !findDeviceOverride(mobileMenuAnimation, device),
          }),
          mobileMenuBackgroundColor: Props.ResponsiveColor({
            label: 'Menu BG color',
            placeholder: 'black',
            // hidden: !findDeviceOverride(mobileMenuAnimation, device),
          }),
          width: Props.Width({ defaultValue: { value: 100, unit: '%' } }),
          margin: Props.Margin(),
        },
      },
      store,
    )

    const unregisterSocialLinks = ReactRuntime.registerComponent(
      SocialLinks,
      {
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
          width: Props.Width({ defaultValue: { value: 100, unit: '%' } }),
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
      },
      store,
    )

    return () => {
      unregisterRoot()
      unregisterBox()
      unregisterImage()
      unregisterCarousel()
      unregisterCountdown()
      unregisterDivider()
      unregisterEmbed()
      unregisterImage()
      unregisterButton()
      unregisterNavigation()
      unregisterSocialLinks()
    }
  }, [])
}

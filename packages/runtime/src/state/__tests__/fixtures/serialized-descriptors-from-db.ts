/**
 * Sample of the descriptors object as stored in the DB and passed by Orion to
 * getTranslatableContent(descriptors, elementTree, { serialized: true }).
 * Keys are component_type, values are the serialized controls row from site_component_descriptors.
 */
export const serializedDescriptorsFromDb: Record<string, Record<string, unknown>> = {
  'makeswift::components::slot::v1': {
    children: {
      type: 'makeswift::controls::slot',
      config: {},
    },
    showFallback: {
      type: 'makeswift::controls::checkbox',
      config: {
        label: 'Use fallback',
        defaultValue: true,
      },
      version: 1,
    },
  },
  './components/Form/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    gap: { type: 'GapY', options: {}, version: 1 },
    size: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    shape: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        preset: [
          { value: { unit: 'px', value: 550 }, deviceId: 'desktop' },
        ],
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    fields: { type: 'TableFormFields', options: {}, version: 1 },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    tableId: { type: 'Table', options: {}, version: 1 },
    contrast: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    brandColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    submitLink: { type: 'Link', options: {}, version: 1 },
    submitLabel: { type: 'TextInput', options: {}, version: 1 },
    submitWidth: { type: 'ResponsiveLength', options: {}, version: 1 },
    submitVariant: { type: 'ResponsiveSelect', options: {}, version: 1 },
    labelTextColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    labelTextStyle: {
      type: 'TextStyle',
      options: { label: 'Label text style' },
      version: 1,
    },
    submitAlignment: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    submitTextColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    submitTextStyle: {
      type: 'TextStyle',
      options: { label: 'Button text style' },
      version: 1,
    },
  },
  './components/Image/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    file: { type: 'Image', options: {}, version: 2 },
    link: { type: 'Link', options: { label: 'On click' }, version: 1 },
    width: { type: 'Width', options: {}, version: 1 },
    border: {
      type: 'Border',
      options: { format: 'makeswift::prop-controllers::border::format::class-name' },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    altText: {
      type: 'TextInput',
      options: { label: 'Alt text' },
      version: 1,
    },
    opacity: { type: 'ResponsiveOpacity', options: {}, version: 1 },
    padding: {
      type: 'Padding',
      options: { format: 'makeswift::prop-controllers::padding::format::class-name' },
      version: 1,
    },
    priority: {
      type: 'Checkbox',
      options: { label: 'Priority' },
      version: 1,
    },
    boxShadow: {
      type: 'Shadows',
      options: { format: 'makeswift::prop-controllers::shadows::format::class-name' },
      version: 1,
    },
    borderRadius: {
      type: 'BorderRadius',
      options: { format: 'makeswift::prop-controllers::border-radius::format::class-name' },
      version: 1,
    },
  },
  './components/Navigation/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    links: { type: 'NavigationLinks', options: {}, version: 1 },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    gutter: {
      type: 'GapX',
      options: {
        max: 100,
        min: 0,
        step: 1,
        label: 'Link gap',
        preset: [{ value: { unit: 'px', value: 10 }, deviceId: 'desktop' }],
        defaultValue: { unit: 'px', value: 0 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    logoFile: { type: 'Image', options: {}, version: 2 },
    logoLink: { type: 'Link', options: {}, version: 1 },
    showLogo: {
      type: 'Checkbox',
      options: { label: 'Show logo', preset: true },
      version: 1,
    },
    alignment: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Alignment',
        options: [
          { icon: 'AlignLeft16', label: 'Left', value: 'flex-start' },
          { icon: 'AlignCenter16', label: 'Center', value: 'center' },
          { icon: 'AlignRight16', label: 'End', value: 'flex-end' },
        ],
        defaultValue: 'flex-end',
      },
      version: 1,
    },
    logoWidth: { type: 'ResponsiveLength', options: {}, version: 1 },
    logoAltText: { type: 'TextInput', options: {}, version: 1 },
    linkTextStyle: { type: 'TextStyle', options: {}, version: 1 },
    mobileMenuAnimation: {
      type: 'ResponsiveSelect',
      options: {
        label: 'Mobile menu',
        options: [
          { label: 'Cover from right', value: 'coverRight' },
          { label: 'Cover from left', value: 'coverLeft' },
        ],
      },
      version: 1,
    },
    mobileMenuOpenIconColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    mobileMenuCloseIconColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    mobileMenuBackgroundColor: { type: 'ResponsiveColor', options: {}, version: 1 },
  },
  './components/Root/index.js': {
    rowGap: { type: 'GapY', options: {}, version: 1 },
    children: { type: 'Grid', options: {}, version: 1 },
    columnGap: { type: 'GapX', options: {}, version: 1 },
    backgrounds: { type: 'Backgrounds', options: {}, version: 2 },
  },
  './components/SocialLinks/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    fill: { type: 'ResponsiveColor', options: {}, version: 1 },
    size: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    links: {
      type: 'SocialLinks',
      options: {
        preset: {
          links: [
            { id: 'facebook', payload: { url: 'https://www.facebook.com', type: 'facebook' } },
            { id: 'instagram', payload: { url: 'https://www.instagram.com', type: 'instagram' } },
            { id: 'twitter', payload: { url: 'https://www.twitter.com', type: 'twitter' } },
          ],
          openInNewTab: false,
        },
      },
      version: 2,
    },
    shape: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    gutter: {
      type: 'GapX',
      options: {
        max: 100,
        min: 0,
        step: 1,
        label: 'Link gap',
        preset: [{ value: { unit: 'px', value: 10 }, deviceId: 'desktop' }],
        defaultValue: { unit: 'px', value: 0 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: {
        format: 'makeswift::prop-controllers::margin::format::class-name',
        preset: [
          {
            value: {
              marginTop: { unit: 'px', value: 10 },
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: { unit: 'px', value: 10 },
            },
            deviceId: 'desktop',
          },
        ],
      },
      version: 1,
    },
    alignment: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Alignment',
        options: [
          { icon: 'AlignLeft16', label: 'flex-start', value: 'flex-start' },
          { icon: 'AlignCenter16', label: 'center', value: 'center' },
          { icon: 'AlignRight16', label: 'flex-end', value: 'flex-end' },
        ],
        defaultValue: 'center',
      },
      version: 1,
    },
    hoverStyle: { type: 'ResponsiveSelect', options: {}, version: 1 },
    backgroundColor: { type: 'ResponsiveColor', options: {}, version: 1 },
  },
  './components/Text/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    text: {
      type: 'makeswift::controls::rich-text-v2',
      config: {
        plugins: [
          {
            control: {
              getValue: {},
              onChange: {},
              definition: {
                type: 'makeswift::controls::select',
                config: {
                  label: 'Block',
                  options: [
                    { label: 'Paragraph', value: 'paragraph' },
                    { label: 'Heading 1', value: 'heading-one' },
                    { label: 'Heading 2', value: 'heading-two' },
                    { label: 'Heading 3', value: 'heading-three' },
                    { label: 'Heading 4', value: 'heading-four' },
                    { label: 'Heading 5', value: 'heading-five' },
                    { label: 'Heading 6', value: 'heading-six' },
                    { label: 'Bulleted list', value: 'unordered-list' },
                    { label: 'Numbered list', value: 'ordered-list' },
                    { label: 'Quote', value: 'blockquote' },
                  ],
                  defaultValue: 'paragraph',
                  labelOrientation: 'horizontal',
                },
              },
            },
          },
          {
            control: {
              getValue: {},
              onChange: {},
              definition: { type: 'makeswift::controls::typography', config: {} },
            },
          },
          {
            control: {
              getValue: {},
              onChange: {},
              definition: {
                type: 'makeswift::controls::style-v2',
                config: {
                  type: {
                    type: 'makeswift::controls::icon-radio-group',
                    config: {
                      label: 'Alignment',
                      options: [
                        { icon: 'TextAlignLeft', label: 'Left Align', value: 'left' },
                        { icon: 'TextAlignCenter', label: 'Center Align', value: 'center' },
                        { icon: 'TextAlignRight', label: 'Right Align', value: 'right' },
                        { icon: 'TextAlignJustify', label: 'Justify', value: 'justify' },
                      ],
                      defaultValue: 'left',
                    },
                  },
                  getStyle: {},
                },
              },
            },
          },
          {
            control: {
              getValue: {},
              onChange: {},
              definition: {
                type: 'makeswift::controls::icon-radio-group',
                config: {
                  label: 'Inline',
                  options: [
                    { icon: 'Superscript16', label: 'Superscript', value: 'superscript' },
                    { icon: 'Subscript16', label: 'Subscript', value: 'subscript' },
                    { icon: 'Code16', label: 'Code', value: 'code' },
                  ],
                },
              },
            },
          },
          {
            control: {
              getValue: {},
              onChange: {},
              definition: {
                type: 'makeswift::controls::link',
                config: { label: 'On Click' },
              },
            },
          },
        ],
        defaultValue:
          'Professionally coordinate cross-platform wins, then holisticly streamline cross-platform channels, and synergistically deploy enterprise-wide web services. ',
      },
    },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        preset: [{ value: { unit: 'px', value: 700 }, deviceId: 'desktop' }],
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: {
        format: 'makeswift::prop-controllers::margin::format::class-name',
        preset: [
          {
            value: {
              marginTop: null,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: { unit: 'px', value: 20 },
            },
            deviceId: 'desktop',
          },
        ],
      },
      version: 1,
    },
  },
  Marquee: {
    logos: {
      type: 'makeswift::controls::list',
      config: {
        type: {
          type: 'makeswift::controls::group',
          config: {
            props: {
              logoAlt: {
                type: 'makeswift::controls::text-input',
                config: { label: 'Logo alt text', defaultValue: 'Image' },
                version: 1,
              },
              logoImage: {
                type: 'makeswift::controls::image',
                config: { label: 'Logo', format: 'makeswift::controls::image::format::with-dimensions' },
                version: 1,
              },
              logoWidth: {
                type: 'makeswift::controls::number',
                config: { label: 'Width', suffix: 'px', defaultValue: 120 },
                version: 1,
              },
            },
            preferredLayout: 'makeswift::controls::group::layout::inline',
          },
        },
        label: 'Logos',
        getItemLabel: {},
      },
    },
    duration: {
      type: 'makeswift::controls::number',
      config: { label: 'Animation duration', suffix: 's', defaultValue: 20 },
      version: 1,
    },
    className: {
      type: 'makeswift::controls::style',
      config: {
        properties: [
          'makeswift::controls::style::property::width',
          'makeswift::controls::style::property::margin',
        ],
      },
    },
    fadeEdges: {
      type: 'makeswift::controls::checkbox',
      config: { label: 'Fade edges', defaultValue: true },
      version: 1,
    },
  },
  './components/Embed/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    html: {
      type: 'TextArea',
      options: { rows: 20, label: 'Code' },
      version: 1,
    },
    width: {
      type: 'Width',
      options: { format: 'makeswift::prop-controllers::width::format::class-name' },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
  },
  './components/Box/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    border: {
      type: 'Border',
      options: { format: 'makeswift::prop-controllers::border::format::class-name' },
      version: 1,
    },
    height: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Height',
        options: [
          { icon: 'HeightAuto16', label: 'Auto', value: 'auto' },
          { icon: 'HeightMatch16', label: 'Stretch', value: 'stretch' },
        ],
        defaultValue: 'auto',
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    rowGap: { type: 'GapY', options: {}, version: 1 },
    padding: {
      type: 'Padding',
      options: {
        format: 'makeswift::prop-controllers::padding::format::class-name',
        preset: [
          {
            value: {
              paddingTop: { unit: 'px', value: 10 },
              paddingLeft: { unit: 'px', value: 10 },
              paddingRight: { unit: 'px', value: 10 },
              paddingBottom: { unit: 'px', value: 10 },
            },
            deviceId: 'desktop',
          },
        ],
      },
      version: 1,
    },
    children: { type: 'Grid', options: {}, version: 1 },
    boxShadow: {
      type: 'Shadows',
      options: { format: 'makeswift::prop-controllers::shadows::format::class-name' },
      version: 1,
    },
    columnGap: { type: 'GapX', options: {}, version: 1 },
    backgrounds: { type: 'Backgrounds', options: {}, version: 2 },
    borderRadius: {
      type: 'BorderRadius',
      options: { format: 'makeswift::prop-controllers::border-radius::format::class-name' },
      version: 1,
    },
    verticalAlign: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Align items',
        options: [
          { icon: 'VerticalAlignStart16', label: 'Top', value: 'flex-start' },
          { icon: 'VerticalAlignMiddle16', label: 'Middle', value: 'center' },
          { icon: 'VerticalAlignEnd16', label: 'Bottom', value: 'flex-end' },
          { icon: 'VerticalAlignSpaceBetween16', label: 'Space between', value: 'space-between' },
        ],
        defaultValue: 'flex-start',
      },
      version: 1,
    },
    boxAnimateType: {
      type: 'ResponsiveSelect',
      options: {
        label: 'Animate box in',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Fade in', value: 'fadeIn' },
          { label: 'Fade right', value: 'fadeRight' },
          { label: 'Fade down', value: 'fadeDown' },
          { label: 'Fade left', value: 'fadeLeft' },
          { label: 'Fade up', value: 'fadeUp' },
          { label: 'Blur in', value: 'blurIn' },
          { label: 'Scale up', value: 'scaleUp' },
          { label: 'Scale down', value: 'scaleDown' },
        ],
        defaultValue: 'none',
        labelOrientation: 'vertical',
      },
      version: 1,
    },
    boxAnimateDelay: { type: 'ResponsiveNumber', options: {}, version: 1 },
    hidePlaceholder: { type: 'Checkbox', options: {}, version: 1 },
    itemAnimateType: {
      type: 'ResponsiveSelect',
      options: {
        label: 'Animate items in',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Fade in', value: 'fadeIn' },
          { label: 'Fade right', value: 'fadeRight' },
          { label: 'Fade down', value: 'fadeDown' },
          { label: 'Fade left', value: 'fadeLeft' },
          { label: 'Fade up', value: 'fadeUp' },
          { label: 'Blur in', value: 'blurIn' },
          { label: 'Scale up', value: 'scaleUp' },
          { label: 'Scale down', value: 'scaleDown' },
        ],
        defaultValue: 'none',
        labelOrientation: 'vertical',
      },
      version: 1,
    },
    itemAnimateDelay: { type: 'ResponsiveNumber', options: {}, version: 1 },
    boxAnimateDuration: { type: 'ResponsiveNumber', options: {}, version: 1 },
    itemAnimateDuration: { type: 'ResponsiveNumber', options: {}, version: 1 },
    itemStaggerDuration: { type: 'ResponsiveNumber', options: {}, version: 1 },
  },
  './components/Button/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    link: {
      type: 'Link',
      options: {
        defaultValue: {
          type: 'OPEN_PAGE',
          payload: { pageId: null, openInNewTab: false },
        },
      },
      version: 1,
    },
    size: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Size',
        options: [
          { icon: 'SizeSmall16', label: 'Small', value: 'small' },
          { icon: 'SizeMedium16', label: 'Medium', value: 'medium' },
          { icon: 'SizeLarge16', label: 'Large', value: 'large' },
        ],
        defaultValue: 'medium',
      },
      version: 1,
    },
    color: { type: 'ResponsiveColor', options: {}, version: 1 },
    shape: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Shape',
        options: [
          { icon: 'ButtonPill16', label: 'Pill', value: 'pill' },
          { icon: 'ButtonRounded16', label: 'Rounded', value: 'rounded' },
          { icon: 'ButtonSquare16', label: 'Square', value: 'square' },
        ],
        defaultValue: 'rounded',
      },
      version: 1,
    },
    width: { type: 'Width', options: {}, version: 1 },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    variant: {
      type: 'ResponsiveSelect',
      options: {
        label: 'Style',
        options: [
          { label: 'Flat', value: 'flat' },
          { label: 'Outline', value: 'outline' },
          { label: 'Floating', value: 'shadow' },
          { label: 'Clear', value: 'clear' },
          { label: 'Blocky', value: 'blocky' },
          { label: 'Bubbly', value: 'bubbly' },
          { label: 'Skewed', value: 'skewed' },
        ],
        defaultValue: 'flat',
        labelOrientation: 'horizontal',
      },
      version: 1,
    },
    children: {
      type: 'TextInput',
      options: { placeholder: 'Button text' },
      version: 1,
    },
    textColor: {
      type: 'ResponsiveColor',
      options: { label: 'Text color', placeholder: 'white' },
      version: 1,
    },
    textStyle: { type: 'TextStyle', options: {}, version: 1 },
  },
  './components/Carousel/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    gap: {
      type: 'GapX',
      options: { step: 5, label: 'Gap', defaultValue: { unit: 'px', value: 0 } },
      version: 1,
    },
    step: { type: 'ResponsiveNumber', options: {}, version: 1 },
    delay: { type: 'Number', options: {}, version: 1 },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: 'px', value: 400 },
      },
      version: 1,
    },
    images: {
      type: 'Images',
      options: {
        preset: [
          { key: 'image-1', props: {} },
          { key: 'image-2', props: {} },
          { key: 'image-3', props: {} },
        ],
      },
      version: 2,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    autoplay: {
      type: 'Checkbox',
      options: { label: 'Autoplay' },
      version: 1,
    },
    dotColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    pageSize: { type: 'ResponsiveNumber', options: {}, version: 1 },
    showDots: {
      type: 'Checkbox',
      options: { label: 'Show dots', preset: true },
      version: 1,
    },
    arrowColor: { type: 'ResponsiveColor', options: {}, version: 1 },
    showArrows: {
      type: 'Checkbox',
      options: { label: 'Show arrows', preset: true },
      version: 1,
    },
    slideBorder: {
      type: 'Border',
      options: { format: 'makeswift::prop-controllers::border::format::class-name' },
      version: 1,
    },
    arrowPosition: { type: 'ResponsiveIconRadioGroup', options: {}, version: 1 },
    slideAlignment: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Alignment',
        options: [
          { icon: 'VerticalAlignStart16', label: 'Top', value: 'flex-start' },
          { icon: 'VerticalAlignMiddle16', label: 'Middle', value: 'center' },
          { icon: 'VerticalAlignEnd16', label: 'Bottom', value: 'flex-end' },
        ],
        defaultValue: 'center',
      },
      version: 1,
    },
    arrowBackground: { type: 'ResponsiveColor', options: {}, version: 1 },
    slideBorderRadius: {
      type: 'BorderRadius',
      options: { format: 'makeswift::prop-controllers::border-radius::format::class-name' },
      version: 1,
    },
  },
  './components/Countdown/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    gap: {
      type: 'GapX',
      options: {
        max: 100,
        min: 0,
        step: 1,
        label: 'Gap',
        preset: [{ value: { unit: 'px', value: 10 }, deviceId: 'desktop' }],
        defaultValue: { unit: 'px', value: 0 },
      },
      version: 1,
    },
    date: { type: 'Date', options: {}, version: 1 },
    size: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Size',
        options: [
          { icon: 'SizeSmall16', label: 'Small', value: 'small' },
          { icon: 'SizeMedium16', label: 'Medium', value: 'medium' },
          { icon: 'SizeLarge16', label: 'Large', value: 'large' },
        ],
        defaultValue: 'medium',
      },
      version: 1,
    },
    shape: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Shape',
        options: [
          { icon: 'ButtonPill16', label: 'Pill', value: 'pill' },
          { icon: 'ButtonRounded16', label: 'Rounded', value: 'rounded' },
          { icon: 'ButtonSquare16', label: 'Square', value: 'square' },
        ],
        defaultValue: 'rounded',
      },
      version: 1,
    },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: 'px', value: 560 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    variant: {
      type: 'ResponsiveIconRadioGroup',
      options: {
        label: 'Style',
        options: [
          { icon: 'CountdownSolid16', label: 'Filled', value: 'filled' },
          { icon: 'CountdownSolidSplit16', label: 'Filled split', value: 'filled-split' },
          { icon: 'CountdownOutline16', label: 'Outline', value: 'outline' },
          { icon: 'CountdownOutlineSplit16', label: 'Outline split', value: 'outline-split' },
          { icon: 'CountdownNaked16', label: 'Clear', value: 'clear' },
        ],
        defaultValue: 'filled',
      },
      version: 1,
    },
    daysLabel: {
      type: 'TextInput',
      options: { label: 'Days label', placeholder: 'Days' },
      version: 1,
    },
    labelFont: { type: 'Font', options: { label: 'Label font' }, version: 1 },
    blockColor: {
      type: 'ResponsiveColor',
      options: { label: 'Block color', placeholder: 'black' },
      version: 1,
    },
    hoursLabel: {
      type: 'TextInput',
      options: { label: 'Hours label', placeholder: 'Hours' },
      version: 1,
    },
    labelColor: {
      type: 'ResponsiveColor',
      options: { label: 'Label color', placeholder: 'black' },
      version: 1,
    },
    numberFont: { type: 'Font', options: { label: 'Number font' }, version: 1 },
    numberColor: {
      type: 'ResponsiveColor',
      options: { label: 'Number color', placeholder: 'white' },
      version: 1,
    },
    minutesLabel: {
      type: 'TextInput',
      options: { label: 'Minutes label', placeholder: 'Minutes' },
      version: 1,
    },
    secondsLabel: {
      type: 'TextInput',
      options: { label: 'Seconds label', placeholder: 'Seconds' },
      version: 1,
    },
  },
  './components/Video/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    video: {
      type: 'Video',
      options: { preset: { controls: true } },
      version: 1,
    },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: 'px', value: 560 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    borderRadius: {
      type: 'BorderRadius',
      options: { format: 'makeswift::prop-controllers::border-radius::format::class-name' },
      version: 1,
    },
  },
  './components/Divider/index.js': {
    id: { type: 'ElementID', options: {}, version: 1 },
    color: {
      type: 'ResponsiveColor',
      options: { placeholder: 'black' },
      version: 1,
    },
    width: {
      type: 'Width',
      options: {
        format: 'makeswift::prop-controllers::width::format::class-name',
        defaultValue: { unit: '%', value: 100 },
      },
      version: 1,
    },
    margin: {
      type: 'Margin',
      options: { format: 'makeswift::prop-controllers::margin::format::class-name' },
      version: 1,
    },
    variant: {
      type: 'ResponsiveSelect',
      options: {
        label: 'Style',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'Blended', value: 'blended' },
        ],
        defaultValue: 'solid',
        labelOrientation: 'horizontal',
      },
      version: 1,
    },
    thickness: {
      type: 'ResponsiveLength',
      options: {
        label: 'Height',
        options: [{ icon: 'Px16', label: 'Pixels', value: 'px' }],
        defaultValue: { unit: 'px', value: 1 },
      },
      version: 1,
    },
  },
  accordions: {
    type: {
      type: 'makeswift::controls::select',
      config: {
        label: 'Type',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Multiple', value: 'multiple' },
        ],
        defaultValue: 'multiple',
      },
    },
    className: {
      type: 'makeswift::controls::style',
      config: {
        properties: [
          'makeswift::controls::style::property::width',
          'makeswift::controls::style::property::margin',
        ],
      },
    },
    accordions: {
      type: 'makeswift::controls::list',
      config: {
        type: {
          type: 'makeswift::controls::group',
          config: {
            props: {
              body: { type: 'makeswift::controls::slot', config: {} },
              title: { type: 'makeswift::controls::slot', config: {} },
            },
            preferredLayout: 'makeswift::controls::group::layout::inline',
          },
        },
        label: 'Accordions',
        getItemLabel: {},
      },
    },
  },
  MextComponent: {
    label: {
      type: 'makeswift::controls::text-input',
      config: { label: 'Label', defaultValue: 'Label' },
      version: 1,
    },
    value: {
      type: 'makeswift::controls::text-input',
      config: { label: 'Value', defaultValue: 'Value' },
      version: 1,
    },
  },
  Tabs: {
    tabs: {
      type: 'makeswift::controls::list',
      config: {
        type: {
          type: 'makeswift::controls::group',
          config: {
            props: {
              title: {
                type: 'makeswift::controls::text-input',
                config: { label: 'Title', defaultValue: 'Tab' },
                version: 1,
              },
              children: { type: 'makeswift::controls::slot', config: {} },
            },
            preferredLayout: 'makeswift::controls::group::layout::inline',
          },
        },
        label: 'Tabs',
        getItemLabel: {},
      },
    },
    ariaLabel: {
      type: 'makeswift::controls::text-input',
      config: { label: 'ARIA Label' },
      version: 1,
    },
    className: {
      type: 'makeswift::controls::style',
      config: {
        properties: [
          'makeswift::controls::style::property::width',
          'makeswift::controls::style::property::margin',
        ],
      },
    },
  },
  './components/Login/index.js': {
    intro: {
      type: 'makeswift::controls::text-input',
      config: { label: 'Intro', defaultValue: 'Welcome to the login page' },
      version: 1,
    },
    titles: {
      type: 'makeswift::controls::list',
      config: {
        type: {
          type: 'makeswift::controls::text-input',
          config: { label: 'Title', defaultValue: 'Section Title' },
          version: 1,
        },
        label: 'Titles',
        getItemLabel: {},
      },
    },
    className: {
      type: 'makeswift::controls::style',
      config: {
        properties: [
          'makeswift::controls::style::property::width',
          'makeswift::controls::style::property::margin',
          'makeswift::controls::style::property::padding',
          'makeswift::controls::style::property::border',
          'makeswift::controls::style::property::border-radius',
        ],
      },
    },
    defaultGreeting: {
      type: 'makeswift::controls::select',
      config: {
        label: 'Default Greeting',
        options: [
          { label: 'Hello', value: 'hello' },
          { label: 'Hi', value: 'hi' },
          { label: 'Hey', value: 'hey' },
        ],
        defaultValue: 'hello',
        labelOrientation: 'horizontal',
      },
    },
  },
}

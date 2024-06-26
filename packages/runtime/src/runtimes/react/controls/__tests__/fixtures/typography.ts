import { Swatch, Typography } from '../../../../../api'
import { Breakpoint } from '../../../../../state/modules/breakpoints'

export const baseTypography: Typography = {
  __typename: 'Typography',
  name: 'headings',
  id: 'VHlwb2dyYXBoeTozMzNhYzcwNy0zMGViLTRiMDktOTY2ZS1mZGZiZGM0MmEyNmQ=',
  style: [
    {
      deviceId: 'desktop',
      value: {
        fontFamily: 'Oswald',
        lineHeight: null,
        letterSpacing: null,
        fontWeight: 400,
        textAlign: null,
        uppercase: null,
        underline: null,
        strikethrough: null,
        italic: false,
        fontSize: {
          value: 24,
          unit: 'px',
        },
        color: null,
      },
    },
  ],
}

export const swatches: Swatch[] = [
  {
    id: 'U3dhdGNoOmNlZmExY2E1LTM1NzktNDBiYi1iZjY0LWFkNzY0ZTJkOGY2MQ==',
    hue: 56,
    saturation: 100,
    lightness: 53.5,
    __typename: 'Swatch',
  },
  {
    id: 'U3dhdGNoOmE0Mzg5YjA5LWQwMWUtNDY5OS1iMGJkLWM2ZDY2NmM1MDVkZQ==',
    hue: 204,
    saturation: 100,
    lightness: 50,
    __typename: 'Swatch',
  },
]

export const breakpoints: Breakpoint[] = [
  {
    id: 'desktop',
    label: 'Desktop',
    minWidth: 1281,
  },
  {
    id: 'external',
    label: 'External',
    minWidth: 1025,
    maxWidth: 1280,
    viewportWidth: 1280,
  },
  {
    id: 'laptop',
    label: 'Laptop',
    minWidth: 769,
    maxWidth: 1024,
    viewportWidth: 1000,
  },
  {
    id: 'tablet',
    label: 'Tablet',
    minWidth: 576,
    maxWidth: 768,
    viewportWidth: 765,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    maxWidth: 575,
    viewportWidth: 390,
  },
]

export const typographyValue = {
  id: 'VHlwb2dyYXBoeTozMzNhYzcwNy0zMGViLTRiMDktOTY2ZS1mZGZiZGM0MmEyNmQ=',
  style: [
    {
      deviceId: 'desktop',
      value: {
        color: {
          alpha: 1,
          swatchId: 'U3dhdGNoOmNlZmExY2E1LTM1NzktNDBiYi1iZjY0LWFkNzY0ZTJkOGY2MQ==',
        },
        fontSize: {
          unit: 'px',
          value: 72,
        },
        fontWeight: 700,
        italic: false,
      },
    },
    {
      deviceId: 'tablet',
      value: {
        color: {
          alpha: 1,
          swatchId: 'U3dhdGNoOmE0Mzg5YjA5LWQwMWUtNDY5OS1iMGJkLWM2ZDY2NmM1MDVkZQ==',
        },
      },
    },
    {
      deviceId: 'mobile',
      value: {
        fontSize: {
          unit: 'px',
          value: 96,
        },
      },
    },
  ],
}

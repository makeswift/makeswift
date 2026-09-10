import { type CSSObject } from '@emotion/serialize'

export const sampleJsStylesObjects: {
  description: string
  className: string
  stylesObject: CSSObject
}[] = [
  {
    description: 'declarations (properties with associated values)',
    className: 'my-red-circle',
    stylesObject: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red',
      borderRadius: '50%',
    },
  },
  {
    description: 'rulesets (selectors with associated declarations)',
    className: 'my-parent',
    stylesObject: {
      '.my-child-1': {
        fontFamily: 'sans-serif',
        '.my-child-2': {
          backgroundColor: 'blue',
        },
      },
      'div[data-status="active"]': {
        backgroundColor: 'green',
      },
    },
  },
  {
    description: 'media queries',
    className: 'my-responsive-font',
    stylesObject: {
      '@media only screen and (min-width: 1281px)': {
        fontFamily: 'Permanent Marker',
        fontSize: '24px',
        fontWeight: 404,
        lineHeight: 1.5,
      },
      '@media only screen and (min-width: 1025px) and (max-width: 1280px)': {
        fontFamily: 'Permanent Marker',
        fontSize: '22px',
        fontWeight: 403,
        lineHeight: 1.5,
      },
      '@media only screen and (min-width: 769px) and (max-width: 1024px)': {
        fontFamily: 'Permanent Marker',
        fontSize: '20px',
        fontWeight: 402,
        lineHeight: 1.5,
      },
      '@media only screen and (min-width: 576px) and (max-width: 768px)': {
        fontFamily: 'Permanent Marker',
        fontSize: '18px',
        fontWeight: 401,
        lineHeight: 1.5,
      },
      '@media only screen and (max-width: 575px)': {
        fontFamily: 'Permanent Marker',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
  },
  {
    description: 'nesting selector (&)',
    className: 'my-purple-effect',
    stylesObject: {
      '&:hover': {
        background: 'purple',
      },
    },
  },
]

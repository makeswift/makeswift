import { Color, Shape } from '@makeswift/runtime/controls'

import { runtime } from '@/makeswift/runtime'

import { MakeswiftCssTheme } from './client'

export const COMPONENT_TYPE = 'app-makeswift-css-theme'

runtime.registerComponent(MakeswiftCssTheme, {
  type: COMPONENT_TYPE,
  label: 'MakeswiftCssTheme (private)',
  hidden: true,
  props: {
    colors: Shape({
      type: {
        primary: Color({ label: 'Primary' }),
        accent: Color({ label: 'Accent' }),
        success: Color({ label: 'Success' }),
        error: Color({ label: 'Error' }),
        warning: Color({ label: 'Warning' }),
        info: Color({ label: 'Info' }),
        background: Color({ label: 'Background' }),
        foreground: Color({ label: 'Foreground' }),
        contrast: Shape({
          type: {
            100: Color({ label: 'Contrast 100' }),
            200: Color({ label: 'Contrast 200' }),
            300: Color({ label: 'Contrast 300' }),
            400: Color({ label: 'Contrast 400' }),
            500: Color({ label: 'Contrast 500' }),
          },
        }),
      },
    }),
  },
})

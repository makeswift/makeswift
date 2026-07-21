import { useMemo } from 'react'
import { Descendant } from 'slate'

import { type ConfigType, Slate, getBaseBreakpoint } from '@makeswift/controls'

import { DefaultBreakpointID } from '../../../../../state/modules/breakpoints'
import { useBreakpoints } from '../../../hooks/use-breakpoints'
import { RichTextV2Definition, RichText } from '../../../../../controls'

export function usePresetValue(config: ConfigType<RichTextV2Definition>): Descendant[] {
  const breakpoints = useBreakpoints()
  return useMemo(
    () => [
      {
        type: Slate.BlockType.Default,
        children: [
          {
            text: config.defaultValue ?? '',
            ...(config.mode === RichText.Mode.Inline
              ? {}
              : {
                  typography: {
                    style: [
                      {
                        deviceId: getBaseBreakpoint(breakpoints).id,
                        value: {
                          fontWeight: 400,
                          fontSize: { value: 18, unit: 'px' },
                          lineHeight: 1.5,
                        },
                      },
                      ...(breakpoints.some(({ id }) => id === DefaultBreakpointID.Mobile)
                        ? [
                            {
                              deviceId: DefaultBreakpointID.Mobile,
                              value: { fontSize: { value: 16, unit: 'px' } },
                            },
                          ]
                        : []),
                    ],
                  },
                }),
          },
        ],
      },
    ],
    [config.mode, config.defaultValue, breakpoints],
  )
}

export const defaultValue = [
  {
    type: Slate.BlockType.Default,
    children: [
      {
        text: '',
      },
    ],
  },
]

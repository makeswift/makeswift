import { useMemo } from 'react'
import { Descendant } from 'slate'
import { Slate, getBaseBreakpoint } from '@makeswift/controls'

import { DefaultBreakpointID } from '../../../../../state/modules/breakpoints'
import { useBreakpoints } from '../../../hooks/use-breakpoints'
import { RichTextV2Definition, RichText } from '../../../../../controls'

export function usePresetValue(definition: RichTextV2Definition): Descendant[] {
  const breakpoints = useBreakpoints()
  return useMemo(
    () => [
      {
        type: Slate.BlockType.Default,
        children: [
          {
            text: definition.config.defaultValue ?? '',
            ...(definition.config.mode === RichText.Mode.Inline
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
    [definition.config.mode, definition.config.defaultValue, breakpoints],
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

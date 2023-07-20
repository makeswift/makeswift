import { Descendant } from 'slate'
import { BlockType } from '../../../../../slate'
import { getBaseBreakpoint, DefaultBreakpointID } from '../../../../../state/modules/breakpoints'
import { useBreakpoints } from '../../..'
import { useMemo } from 'react'
import { RichTextV2ControlDefinition, RichTextV2Mode } from '../../../../../controls'

export function usePresetValue(definition: RichTextV2ControlDefinition): Descendant[] {
  const breakpoints = useBreakpoints()
  return useMemo(
    () => [
      {
        type: BlockType.Default,
        children: [
          {
            text: definition.config.defaultValue ?? '',
            ...(definition.config.mode === RichTextV2Mode.Inline
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
    type: BlockType.Default,
    children: [
      {
        text: '',
      },
    ],
  },
]

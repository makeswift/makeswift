/** @jest-environment jsdom */

import { ResponsiveIconRadioGroup, type Value } from '@makeswift/prop-controllers'
import { forwardRef } from 'react'

import { pagePropControllerTest } from './page-prop-controller'

pagePropControllerTest(
  ResponsiveIconRadioGroup,
  [
    {
      deviceId: 'desktop',
      value: 'stretch',
    },
  ],
  testId =>
    forwardRef<HTMLDivElement, { propKey?: Value<typeof ResponsiveIconRadioGroup> }>(
      ({ propKey }, ref) => (
        <div ref={ref} data-testid={testId}>
          {propKey?.at(0)?.value}
        </div>
      ),
    ),
  element => expect(element).toHaveTextContent('stretch'),
  {
    options: [
      { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
      { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
    ],
  },
)

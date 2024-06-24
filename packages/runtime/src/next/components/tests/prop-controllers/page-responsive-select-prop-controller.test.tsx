/** @jest-environment jsdom */

import { ResponsiveSelect, type Value } from '@makeswift/prop-controllers'
import { forwardRef } from 'react'

import { pagePropControllerTest } from './page-prop-controller'

pagePropControllerTest(
  ResponsiveSelect,
  [
    {
      deviceId: 'desktop',
      value: 'dashed',
    },
  ],
  testId =>
    forwardRef<HTMLDivElement, { propKey?: Value<typeof ResponsiveSelect> }>(({ propKey }, ref) => (
      <div ref={ref} data-testid={testId}>
        {propKey?.at(0)?.value}
      </div>
    )),
  element => expect(element).toHaveTextContent('dashed'),
  {
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
    ],
  },
)

/** @jest-environment jsdom */

import { GapX, ResponsiveGapData } from '@makeswift/prop-controllers'
import { forwardRef } from 'react'

import { pagePropControllerTest } from './page-prop-controller'

pagePropControllerTest(
  GapX,
  [
    {
      deviceId: 'desktop',
      value: { value: 17, unit: 'px' },
    },
  ],
  testId =>
    forwardRef<HTMLDivElement, { propKey?: ResponsiveGapData }>(({ propKey }, ref) => (
      <div ref={ref} data-testid={testId}>
        {propKey?.at(0)?.value.value}
      </div>
    )),
  element => expect(element).toHaveTextContent('17'),
)

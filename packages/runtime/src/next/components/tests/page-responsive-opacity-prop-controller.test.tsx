/** @jest-environment jsdom */

import { ResponsiveOpacity, ResponsiveOpacityValue } from '@makeswift/prop-controllers'
import { forwardRef } from 'react'

import { pagePropControllerTest } from './page-prop-controller'

pagePropControllerTest(
  ResponsiveOpacity,
  [
    {
      deviceId: 'desktop',
      value: 42,
    },
  ],
  testId =>
    forwardRef<HTMLDivElement, { propKey?: ResponsiveOpacityValue }>(({ propKey }, ref) => (
      <div ref={ref} data-testid={testId}>
        {propKey?.at(0)?.value}
      </div>
    )),
  element => expect(element).toHaveTextContent('42'),
)

/** @jest-environment jsdom */

import { ResponsiveNumber, ResponsiveNumberValue } from '@makeswift/prop-controllers'
import { forwardRef } from 'react'

import { pagePropControllerTest } from './page-prop-controller'

pagePropControllerTest(
  ResponsiveNumber,
  [
    {
      deviceId: 'desktop',
      value: 42,
    },
  ],
  testId =>
    forwardRef<HTMLDivElement, { propKey?: ResponsiveNumberValue }>(({ propKey }, ref) => (
      <div ref={ref} data-testid={testId}>
        {propKey?.at(0)?.value}
      </div>
    )),
  element => expect(element).toHaveTextContent('42'),
)

/** @jest-environment jsdom */

import { act } from 'react'
import { render, screen } from '@testing-library/react'

import { matchMedia, setMedia } from 'mock-match-media'

import { useMediaQuery } from '../useMediaQuery'

import { createReactRuntime } from '../../../runtimes/react/testing/react-runtime'
import { RuntimeProvider } from '../../../runtimes/react/components/RuntimeProvider'

const breakpoints = {
  mobile: { width: 575, viewport: 390, label: 'Mobile' },
  tablet: { width: 768, viewport: 765, label: 'Tablet' },
  laptop: { width: 1024, viewport: 1000, label: 'Laptop' },
  external: { width: 1280, label: 'External' },
}

type DeviceId = keyof typeof breakpoints | 'desktop'

const responsiveValue: Array<{ deviceId: DeviceId; value: string }> = [
  {
    deviceId: 'desktop',
    value: 'none',
  },
  {
    deviceId: 'external',
    value: 'fadeTop',
  },
  {
    deviceId: 'laptop',
    value: 'fadeRight',
  },
  {
    deviceId: 'tablet',
    value: 'fadeLeft',
  },
  {
    deviceId: 'mobile',
    value: 'blurIn',
  },
]

const testId = 'test-id'

const TestComponent = () => {
  const value = useMediaQuery(responsiveValue)
  return <div data-testid={testId}>{value}</div>
}

let oldMatchMedia: any

describe('useMediaQuery', () => {
  beforeEach(() => {
    oldMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMedia,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', { writable: true, value: oldMatchMedia })
  })

  test.each([
    { width: 1300, expectedValue: 'none' },
    { width: 1280, expectedValue: 'fadeTop' },
    { width: 1100, expectedValue: 'fadeTop' },
    { width: 1024, expectedValue: 'fadeRight' },
    { width: 800, expectedValue: 'fadeRight' },
    { width: 768, expectedValue: 'fadeLeft' },
    { width: 600, expectedValue: 'fadeLeft' },
    { width: 575, expectedValue: 'blurIn' },
    { width: 200, expectedValue: 'blurIn' },
  ])(
    'returns responsive value matching current media breakpoint ($width px)',
    async ({ width, expectedValue }) => {
      const runtime = createReactRuntime({ breakpoints })

      setMedia({ width })

      await act(async () =>
        render(
          <RuntimeProvider runtime={runtime} siteVersion={null}>
            <TestComponent />
          </RuntimeProvider>,
        ),
      )

      expect(screen.getByTestId(testId)).toHaveTextContent(expectedValue)
    },
  )
})

/** @jest-environment jsdom */

import { act, forwardRef } from 'react'
import { render, screen } from '@testing-library/react'

import { createSnippet } from '../../../../testing/fixtures'

import {
  type FrameworkContext,
  FrameworkContextProvider,
  useFrameworkContext,
} from '../framework-context'

const testId = 'test-id'

const Head: FrameworkContext['Head'] = ({ children }) => (
  <>
    <meta name="extra" />
    {children}
  </>
)

const Link: FrameworkContext['Link'] = forwardRef(({ href, children }, _ref) => (
  <a href={href} data-test-id="custom link">
    {children}
  </a>
))

const Image1: FrameworkContext['Image'] = forwardRef(({ src, alt }, _ref) => (
  <img src={src} alt={alt} data-test-id="custom image 1" />
))

const Image2: FrameworkContext['Image'] = forwardRef(({ src, alt }, _ref) => (
  <img src={src} alt={alt} data-test-id="custom image 2" />
))

const TestComponent = () => {
  const { Head, HeadSnippet, Image, Link } = useFrameworkContext()
  return (
    <div data-testid={testId}>
      <Head>
        <title>Document title</title>
      </Head>
      <HeadSnippet
        snippet={createSnippet({
          id: 'test-snippet',
          code: '<script>console.log("hello")</script>',
        })}
      />
      <Image src="https://example.com/image.jpg" alt="example image" />
      <Link href="https://example.com">Click here</Link>
    </div>
  )
}

test('useFrameworkContext without a provider returns default context', async () => {
  await act(async () => render(<TestComponent />))
  expect(screen.getByTestId(testId)).toMatchSnapshot()
  expect(document.head).toMatchSnapshot('head')
})

test('Provider values override default context', async () => {
  await act(async () =>
    render(
      <FrameworkContextProvider value={{ Link }}>
        <TestComponent />
      </FrameworkContextProvider>,
    ),
  )
  expect(screen.getByTestId(testId)).toMatchSnapshot()
  expect(document.head).toMatchSnapshot('head')
})

test('Providers are stackable, support partial overrides', async () => {
  await act(async () =>
    render(
      <FrameworkContextProvider value={{ Link, Image: Image1 }}>
        <FrameworkContextProvider value={{ Image: Image2 }}>
          <FrameworkContextProvider value={{ Head }}>
            <TestComponent />
          </FrameworkContextProvider>
        </FrameworkContextProvider>
      </FrameworkContextProvider>,
    ),
  )
  expect(screen.getByTestId(testId)).toMatchSnapshot()
  expect(document.head).toMatchSnapshot('head')
})

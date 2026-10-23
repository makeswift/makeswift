/** @jest-environment jsdom */

import { act } from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import { type GetFontsAPI } from '../../../../client'
import { ReactProvider, createReactRuntime } from '../../testing'
import { MakeswiftFonts } from '../MakeswiftFonts'

const fonts: GetFontsAPI = {
  siteId: 'site',
  googleFonts: [{ family: 'Open Sans', variants: ['400'] }],
  customFontVariants: [
    {
      id: 'variant',
      family: 'Brand Sans',
      weight: 700,
      style: 'italic',
      fileUrl: 'https://fonts.example.com/brand.woff2',
      fileFormat: 'woff2',
    },
  ],
}

const getCustomFontStyles = () =>
  Array.from(document.querySelectorAll('style')).filter(style =>
    style.textContent?.includes('@font-face'),
  )

async function renderFonts(...fontsList: GetFontsAPI[]) {
  await act(async () =>
    render(
      <ReactProvider runtime={createReactRuntime()}>
        {fontsList.map((fonts, index) => (
          <MakeswiftFonts key={index} fonts={fonts} />
        ))}
      </ReactProvider>,
    ),
  )
}

afterEach(() => {
  document.head.innerHTML = ''
})

describe('MakeswiftFonts', () => {
  test('renders the Google Fonts stylesheet and custom font faces', async () => {
    await renderFonts(fonts)

    expect(document.head.querySelector('link[rel="stylesheet"]')).toHaveAttribute(
      'href',
      'https://fonts.googleapis.com/css?family=Open+Sans:400&display=swap',
    )

    // React 19 hoists the style to document.head
    const styles = getCustomFontStyles()
    expect(styles).toHaveLength(1)
    expect(document.head).toContainElement(styles[0])
    expect(styles[0].textContent).toBe(
      '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand.woff2"); font-weight: 700; font-style: italic; font-display: swap; }',
    )
  })

  test('renders identical custom font faces once', async () => {
    await renderFonts(fonts, fonts)

    expect(getCustomFontStyles()).toHaveLength(1)
  })

  test('renders no custom font styles without custom font variants', async () => {
    await renderFonts({ ...fonts, customFontVariants: [] })

    expect(getCustomFontStyles()).toEqual([])
  })
})

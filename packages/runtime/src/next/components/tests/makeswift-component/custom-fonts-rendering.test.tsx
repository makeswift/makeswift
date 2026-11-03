/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { type CustomFontVariant } from '../../../../client'
import * as Testing from '../../../testing'

import { elementData, renderComponentSnapshot } from './fixtures'

const customFontVariants: CustomFontVariant[] = [
  {
    id: 'variant',
    family: 'Brand Sans',
    weight: 700,
    style: 'italic',
    fileUrl: 'https://fonts.example.com/brand.woff2',
    fileFormat: 'woff2',
  },
]

const getCustomFontStyles = () =>
  Array.from(document.querySelectorAll('style')).filter(style =>
    style.textContent?.includes('@font-face'),
  )

describe('MakeswiftComponent', () => {
  describe('custom font rendering', () => {
    test("renders the snapshot's custom fonts", async () => {
      const snapshot = {
        ...Testing.createMakeswiftComponentSnapshot(elementData({ text: 'Hello World' })),
        customFonts: { siteId: 'test-site-id', variants: customFontVariants },
      }

      await renderComponentSnapshot(snapshot)

      // React 19 hoists the style to document.head
      const styles = getCustomFontStyles()
      expect(styles).toHaveLength(1)
      expect(document.head).toContainElement(styles[0])
      expect(styles[0].textContent).toBe(
        '@font-face{font-family:Brand Sans;font-weight:700;font-style:italic;src:url(https://fonts.example.com/brand.woff2);}',
      )
    })

    test.each([
      { label: 'none', customFonts: { siteId: 'test-site-id', variants: [] } },
      { label: 'fonts that failed to fetch', customFonts: null },
      { label: 'a snapshot without them', customFonts: undefined },
    ])('renders no custom font styles for $label', async ({ customFonts }) => {
      const snapshot = {
        ...Testing.createMakeswiftComponentSnapshot(elementData({ text: 'Hello World' })),
        customFonts,
      }

      await renderComponentSnapshot(snapshot)

      expect(getCustomFontStyles()).toEqual([])
    })
  })
})

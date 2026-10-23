/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { type CustomFontVariant } from '../../../client'

import { createMakeswiftPageSnapshot, testMakeswiftPageHeadRendering } from '../../testing'

import { pageDocument } from './__fixtures__/page-document'

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

describe('MakeswiftPage', () => {
  describe('custom font rendering', () => {
    // Only the App Router: `next/head` renders nothing here without Next's head manager
    test("renders the snapshot's custom fonts", async () => {
      const snapshot = { ...createMakeswiftPageSnapshot(pageDocument), customFontVariants }

      await testMakeswiftPageHeadRendering({ snapshot })

      // React 19 hoists the style to document.head
      const styles = getCustomFontStyles()
      expect(styles).toHaveLength(1)
      expect(document.head).toContainElement(styles[0])
      expect(styles[0].textContent).toBe(
        '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand.woff2"); font-weight: 700; font-style: italic; font-display: swap; }',
      )
    })

    test.each([
      { label: 'none', customFontVariants: [] },
      { label: 'a snapshot without them', customFontVariants: undefined },
    ])('renders no custom font styles for $label', async ({ customFontVariants }) => {
      const snapshot = { ...createMakeswiftPageSnapshot(pageDocument), customFontVariants }

      await testMakeswiftPageHeadRendering({ snapshot })

      expect(getCustomFontStyles()).toEqual([])
    })
  })
})

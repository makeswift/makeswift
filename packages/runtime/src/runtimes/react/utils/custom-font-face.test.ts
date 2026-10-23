import { type Site } from '../../../api'

import { getCustomFontFaceCss, getCustomFontVariantsFromSite } from './custom-font-face'

describe('getCustomFontVariantsFromSite', () => {
  const site = (customFontFamilies?: Site['customFontFamilies']) =>
    ({ __typename: 'Site', id: 'site', googleFonts: { edges: [] }, customFontFamilies }) as Site

  test("keeps the site's active variants", () => {
    const variants = getCustomFontVariantsFromSite(
      site([
        {
          family: 'Brand Sans',
          variants: [
            { weight: 400, style: 'normal', fontFileUrl: 'https://f.test/400', isActive: true },
            { weight: 700, style: 'italic', fontFileUrl: 'https://f.test/700i', isActive: true },
            { weight: 900, style: 'normal', fontFileUrl: 'https://f.test/900', isActive: false },
          ],
        },
      ]),
    )

    expect(variants).toEqual([
      { family: 'Brand Sans', weight: 400, style: 'normal', fileUrl: 'https://f.test/400' },
      { family: 'Brand Sans', weight: 700, style: 'italic', fileUrl: 'https://f.test/700i' },
    ])
  })

  test('returns null for a site sent without custom fonts', () => {
    expect(getCustomFontVariantsFromSite(site(undefined))).toBeNull()
  })
})

describe('getCustomFontFaceCss', () => {
  test('returns one swapping @font-face rule per variant', () => {
    const css = getCustomFontFaceCss([
      {
        family: 'Brand Sans',
        weight: 400,
        style: 'normal',
        fileUrl: 'https://fonts.example.com/brand-400.woff2',
      },
      {
        family: 'Brand Sans',
        weight: 700,
        style: 'italic',
        fileUrl: 'https://fonts.example.com/brand-700i.woff2',
      },
      {
        family: 'Accent',
        weight: 400,
        style: 'normal',
        fileUrl: 'https://fonts.example.com/accent.woff',
      },
    ])

    expect(css.split('\n')).toEqual([
      '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand-400.woff2"); font-weight: 400; font-style: normal; font-display: swap; }',
      '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand-700i.woff2"); font-weight: 700; font-style: italic; font-display: swap; }',
      '@font-face { font-family: "Accent"; src: url("https://fonts.example.com/accent.woff"); font-weight: 400; font-style: normal; font-display: swap; }',
    ])
  })

  test('writes any style other than italic as normal', () => {
    const css = getCustomFontFaceCss([
      {
        family: 'A',
        weight: 400,
        style: 'oblique; } body { color: red',
        fileUrl: 'https://f.test/a',
      },
    ])

    expect(css).toContain('font-style: normal;')
    expect(css).not.toContain('color: red')
  })

  test('escapes values that would end the CSS string or the style element', () => {
    const css = getCustomFontFaceCss([
      {
        family: 'Evil "Sans" \\ </style><script>',
        weight: 400,
        style: 'normal',
        fileUrl: 'https://fonts.example.com/a.woff2',
      },
    ])

    expect(css).toContain('font-family: "Evil \\22 Sans\\22  \\5c  \\3c /style>\\3c script>";')
    expect(css).not.toContain('</style')
  })

  test('returns an empty string without variants', () => {
    expect(getCustomFontFaceCss([])).toBe('')
  })
})

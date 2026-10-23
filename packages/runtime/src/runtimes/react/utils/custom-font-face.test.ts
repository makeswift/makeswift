import { type Site } from '../../../api'

import { getCustomFontFaceRules, getCustomFontVariantsFromSite } from './custom-font-face'

describe('getCustomFontVariantsFromSite', () => {
  const site = (customFontFamilies: Site['customFontFamilies']) =>
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
    expect(getCustomFontVariantsFromSite(site(undefined as never))).toBeNull()
  })
})

describe('getCustomFontFaceRules', () => {
  test('returns one swapping @font-face rule per variant', () => {
    const rules = getCustomFontFaceRules([
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

    expect(rules).toEqual([
      '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand-400.woff2"); font-weight: 400; font-style: normal; font-display: swap; }',
      '@font-face { font-family: "Brand Sans"; src: url("https://fonts.example.com/brand-700i.woff2"); font-weight: 700; font-style: italic; font-display: swap; }',
      '@font-face { font-family: "Accent"; src: url("https://fonts.example.com/accent.woff"); font-weight: 400; font-style: normal; font-display: swap; }',
    ])
  })

  test('writes any style other than italic as normal', () => {
    const rules = getCustomFontFaceRules([
      {
        family: 'A',
        weight: 400,
        style: 'oblique; } body { color: red',
        fileUrl: 'https://f.test/a',
      },
    ])

    expect(rules).toHaveLength(1)
    expect(rules[0]).toContain('font-style: normal;')
    expect(rules[0]).not.toContain('color: red')
  })

  test('escapes values that would end the CSS string or the style element', () => {
    const rules = getCustomFontFaceRules([
      {
        family: 'Evil "Sans" \\ </style><script>',
        weight: 400,
        style: 'normal',
        fileUrl: 'https://fonts.example.com/a.woff2',
      },
    ])

    expect(rules).toHaveLength(1)
    expect(rules[0]).toContain('font-family: "Evil \\22 Sans\\22  \\5c  \\3c /style>\\3c script>";')
    expect(rules[0]).not.toContain('</style')
  })

  test('returns one rule for duplicate variants', () => {
    const variant = {
      family: 'Brand Sans',
      weight: 400,
      style: 'normal',
      fileUrl: 'https://fonts.example.com/brand.woff2',
    }

    expect(getCustomFontFaceRules([variant, { ...variant }])).toHaveLength(1)
  })

  test('returns no rules without variants', () => {
    expect(getCustomFontFaceRules([])).toEqual([])
  })
})

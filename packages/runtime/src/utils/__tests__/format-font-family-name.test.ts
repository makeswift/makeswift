import { formatFontFamilyName } from '../format-font-family-name'

describe('formatFontFamilyName', () => {
  test.each([
    ['Inter', '"Inter"'],
    ['Redaction 50', '"Redaction 50"'],
    ['3D Font', '"3D Font"'],
    ['My.Font', '"My.Font"'],
    ['Font/Slash', '"Font/Slash"'],
    ['#Hash', '"#Hash"'],
    ["O'Brien Sans", '"O\'Brien Sans"'],
    ['Semi;colon {Brace} /* comment */', '"Semi;colon {Brace} /* comment */"'],
    ['Ünïcödé 字体 😀', '"Ünïcödé 字体 😀"'],
    ['  Padded  ', '"  Padded  "'],
  ])('quotes %j', (input, expected) => {
    expect(formatFontFamilyName(input)).toBe(expected)
  })

  test.each(['serif', 'sans-serif', 'monospace', 'inherit', 'initial', 'unset', 'default'])(
    'quotes %j so it names a font rather than a CSS keyword',
    input => {
      expect(formatFontFamilyName(input)).toBe(`"${input}"`)
    },
  )

  test.each([
    ['Say "Hi" Sans', '"Say \\"Hi\\" Sans"'],
    ['It\'s "Mixed"', '"It\'s \\"Mixed\\""'],
    ['Back\\slash', '"Back\\\\slash"'],
    ['Trailing\\', '"Trailing\\\\"'],
    ['\\"', '"\\\\\\""'],
    [
      'x";} body { display: none } .y { font-family: "',
      '"x\\";} body { display: none } .y { font-family: \\""',
    ],
  ])('escapes quotes and backslashes in %j', (input, expected) => {
    expect(formatFontFamilyName(input)).toBe(expected)
  })

  test.each([
    ['Line\nBreak', '"Line\\a Break"'],
    ['Carriage\rReturn', '"Carriage\\d Return"'],
    ['Tab\tStop', '"Tab\\9 Stop"'],
    ['Form\fFeed', '"Form\\c Feed"'],
    ['Delete\u007fChar', '"Delete\\7f Char"'],
  ])('writes the control character in %j as a hex escape', (input, expected) => {
    expect(formatFontFamilyName(input)).toBe(expected)
  })

  test('keeps a comma-separated value as one literal family name', () => {
    expect(formatFontFamilyName('Inter, sans-serif')).toBe('"Inter, sans-serif"')
  })

  test.each([
    'var(--font-sans)',
    'VAR(--font-sans)',
    ' var(--font-sans)',
    'var(--font-sans, serif)',
  ])('leaves the CSS variable %j unchanged', input => {
    expect(formatFontFamilyName(input)).toBe(input)
  })
})

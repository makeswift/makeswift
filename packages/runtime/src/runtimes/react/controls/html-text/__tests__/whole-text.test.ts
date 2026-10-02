/** @jest-environment jsdom */

import { setWholeTextFormat, setWholeTextLink, wholeTextFormats } from '../whole-text'

describe('whole text', () => {
  test('a format is on only when all the text has it', () => {
    expect(wholeTextFormats('<p><b>Fish</b> <strong>chips</strong></p>').bold).toBe(true)
    expect(wholeTextFormats('<p><b>Fish</b> and chips</p>').bold).toBe(false)
    expect(wholeTextFormats('').bold).toBe(false)
  })

  test('turns a format on for all the text, and off again', () => {
    const bold = setWholeTextFormat('<p>Fish <em>and</em> <b>chips</b></p>', 'bold', true)

    expect(bold).toBe(
      '<p><strong>Fish </strong><em><strong>and</strong></em> <strong>chips</strong></p>',
    )
    expect(wholeTextFormats(bold).bold).toBe(true)
    expect(setWholeTextFormat(bold, 'bold', false)).toBe('<p>Fish <em>and</em> chips</p>')
  })

  test('reads and sets the link of all the text', () => {
    const linked = setWholeTextLink('<p>Fish <a href="/old">chips</a></p>', {
      href: 'https://example.com',
      openInNewTab: true,
    })

    expect(wholeTextFormats(linked).link).toEqual({
      href: 'https://example.com',
      openInNewTab: true,
    })
    expect(wholeTextFormats('<p>Fish <a href="/a">chips</a></p>').link).toBeNull()
    expect(setWholeTextLink(linked, null)).toBe('<p>Fish chips</p>')
  })
})

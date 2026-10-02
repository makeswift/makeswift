/**
 * @jest-environment jsdom
 */
import { htmlToNodes, nodesToHtml, rawHtmlElement } from './html'

const roundTrip = (html: string, phrasing = false) => nodesToHtml(htmlToNodes(html, { phrasing }))

describe('Page Builder HTML conversion', () => {
  test.each([
    ['<p>Plain</p>', '<p>Plain</p>'],
    [
      '<p>A <strong>bold</strong> and <em>italic</em> word</p>',
      '<p>A <strong>bold</strong> and <em>italic</em> word</p>',
    ],
    [
      '<p><span style="text-decoration: underline;">u</span><span style="text-decoration: line-through;">s</span></p>',
      '<p><span style="text-decoration: underline;">u</span><span style="text-decoration: line-through;">s</span></p>',
    ],
    [
      '<p><u>u</u><s>s</s></p>',
      '<p><span style="text-decoration: underline;">u</span><span style="text-decoration: line-through;">s</span></p>',
    ],
    ['<p style="text-align: center">Centered</p>', '<p style="text-align: center">Centered</p>'],
    ['<p>One<br>Two</p>', '<p>One<br>Two</p>'],
    [
      '<p><a href="/shop" target="_blank">Shop</a> now</p>',
      '<p><a href="/shop" target="_blank">Shop</a> now</p>',
    ],
    ['Loose text', '<p>Loose text</p>'],
    ['<p>a &amp; b &lt;c&gt;</p>', '<p>a &amp; b &lt;c&gt;</p>'],
  ])('block: %s', (input, expected) => {
    expect(roundTrip(input)).toBe(expected)
  })

  test.each([
    ['Section <strong>Heading</strong>', 'Section <strong>Heading</strong>'],
    ['<p>One</p><p>Two</p>', 'One<br>Two'],
  ])('phrasing: %s', (input, expected) => {
    expect(roundTrip(input, true)).toBe(expected)
  })

  test('drops unsafe links and unknown markup', () => {
    expect(
      roundTrip(
        '<p><a href="javascript:alert(1)">x</a><span class="c" style="color:red">y</span><img src="z"></p>',
      ),
    ).toBe('<p>xy</p>')
  })
  test('writes a raw HTML element as it is', () => {
    const html = '<p class="lead">Keep <b>this</b> <img src="x"></p>'

    expect(nodesToHtml([rawHtmlElement(html) as any])).toBe(html)
  })

  test('a phrasing host gets default blocks, a block host gets paragraphs', () => {
    expect((htmlToNodes('One', { phrasing: true })[0] as any).type).toBe('default')
    expect((htmlToNodes('One', { phrasing: false })[0] as any).type).toBe('paragraph')
  })
})

/** @jest-environment jsdom */

import { mountWholeTextEditor } from '../hugerte-editor'

async function wholeText(html: string, tagName = 'div') {
  const host = document.createElement(tagName)
  host.innerHTML = html
  document.body.appendChild(host)

  const onChange = jest.fn((value: string) => {
    host.innerHTML = value
  })

  return { host, onChange, editor: await mountWholeTextEditor(host, onChange) }
}

describe('the whole text editor', () => {
  test('a format is on only when all the text has it', async () => {
    expect(
      (await wholeText('<p><b>Fish</b> <strong>chips</strong></p>')).editor.formats().bold,
    ).toBe(true)
    expect((await wholeText('<p><b>Fish</b> and chips</p>')).editor.formats().bold).toBe(false)
    expect((await wholeText('')).editor.formats().bold).toBe(false)
  })

  test('turns a format on for all the text, and off again', async () => {
    const { host, onChange, editor } = await wholeText('<p>Fish <em>and</em> <b>chips</b></p>')

    editor.setFormat('bold', true)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(editor.formats().bold).toBe(true)

    editor.setFormat('bold', false)
    expect(editor.formats().bold).toBe(false)
    expect(host.innerHTML).toBe('<p>Fish <em>and</em> chips</p>')
  })

  test('reads and sets the link of all the text', async () => {
    const { editor } = await wholeText('<p>Fish <a href="/old">chips</a></p>')

    expect(editor.formats().link).toBeNull()

    editor.setLink({ href: 'https://example.com', openInNewTab: true })
    expect(editor.formats().link).toEqual({ href: 'https://example.com', openInNewTab: true })

    editor.setLink(null)
    expect(editor.formats().link).toBeNull()
  })

  test('does not add a paragraph to the text of a phrasing host', async () => {
    const { host, editor } = await wholeText('Fish <b>chips</b>', 'h2')

    editor.setFormat('italic', true)
    expect(host.querySelector('p')).toBeNull()
  })
})

/**
 * @jest-environment jsdom
 */
import { createEditor, Editor, Transforms } from 'slate'

import { fromHtml, rawHtmlElement, toHtml, withPageBuilderHtml } from '.'

function editorWith(html: string, phrasing: boolean) {
  const editor = withPageBuilderHtml(createEditor(), { phrasing })
  editor.children = [rawHtmlElement(html) as any]
  return editor
}

const selectStart = (editor: Editor) =>
  Transforms.select(editor, { anchor: Editor.start(editor, []), focus: Editor.start(editor, []) })

describe('PageBuilderHtmlPlugin', () => {
  test('a raw HTML element is void', () => {
    const editor = editorWith('<p>Hi</p>', false)

    expect(Editor.isVoid(editor, editor.children[0] as any)).toBe(true)
  })

  test('the first selection turns the raw HTML into editable nodes and selects all', () => {
    const editor = editorWith('<p>One <strong>two</strong></p><p>Three</p>', false)

    selectStart(editor)

    expect(editor.children.map((node: any) => node.type)).toEqual(['paragraph', 'paragraph'])
    expect(Editor.string(editor, [])).toBe('One twoThree')
    expect(editor.selection).toEqual({
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
  })

  test('a phrasing host gets one default block', () => {
    const editor = editorWith('Section <em>Heading</em>', true)

    selectStart(editor)

    expect(editor.children).toHaveLength(1)
    expect((editor.children[0] as any).type).toBe('default')
  })

  test('the conversion has no operations, so it saves nothing', async () => {
    const editor = editorWith('<p>Hi</p>', false)
    const operations: string[] = []
    const { onChange } = editor
    editor.onChange = options => {
      if (options?.operation) operations.push(options.operation.type)
      onChange(options)
    }

    selectStart(editor)
    // Slate calls `onChange` in a microtask.
    await Promise.resolve()

    expect(operations).toEqual(['set_selection'])
  })

  test('a deselect does not convert the raw HTML', () => {
    const editor = editorWith('<p>Hi</p>', false)

    Transforms.deselect(editor)

    expect((editor.children[0] as any).type).toBe('raw-html')
  })

  test('fromHtml keeps the HTML exactly through toHtml', () => {
    const html = '<p class="x">Keep <b>all</b> of <img src="y"> this</p>'

    expect(toHtml(fromHtml(html))).toBe(html)
  })

  test('toHtml writes the edited nodes with the TinyMCE tags', () => {
    const editor = editorWith('A <b>bold</b> word', true)

    selectStart(editor)

    expect(toHtml({ version: 2, key: 'k', descendants: editor.children } as any)).toBe(
      'A <strong>bold</strong> word',
    )
  })
})

describe('PageBuilderHtmlPlugin leaves', () => {
  test('put the leaf attributes on the outermost mark tag', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToStaticMarkup } = require('react-dom/server')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { pageBuilderHtmlPlugins } = require('.')
    const [typography] = pageBuilderHtmlPlugins()
    const renderLeaf = typography.renderLeaf(() => null, undefined)
    const leaf = {
      text: 'x',
      typography: { style: [{ deviceId: 'desktop', value: { fontWeight: 700, italic: true } }] },
    }

    expect(
      renderToStaticMarkup(
        renderLeaf({ attributes: { 'data-slate-leaf': true }, children: 'x', leaf, text: leaf }),
      ),
    ).toBe('<em data-slate-leaf="true"><strong>x</strong></em>')
  })
})

describe('expandRawHtmlData', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { expandRawHtmlData, fromHtml: toData } = require('.')

  test('expands the raw HTML and keeps the key, so it saves nothing', () => {
    const data = toData('<p>One</p><p>Two</p>')
    const expanded = expandRawHtmlData(data, { phrasing: false })

    expect(expanded.key).toBe(data.key)
    expect(expanded.descendants.map((node: any) => node.type)).toEqual(['paragraph', 'paragraph'])
  })

  test('returns edited data as it is', () => {
    const data = expandRawHtmlData(toData('Hi'), { phrasing: true })

    expect(expandRawHtmlData(data, { phrasing: true })).toBe(data)
  })
})

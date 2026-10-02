import { deserializeRecord } from '@makeswift/controls'

import { deserializeUnifiedControlDef } from '../../serialization/base'
import { ClientMessagePortSerializationVisitor } from '../../serialization/message-port/visitor'
import { functionDeserializationPlugin } from '../../serialization/message-port/function-serialization'

import { type HtmlTextFormats, HtmlText, HtmlTextDefinition, HtmlTextControl } from '..'

const instanceKey = { elementKey: 'element', propPath: 'text' }

function createControl(defaultValue = '<p>Default</p>') {
  const sendMessage = jest.fn()
  const control = HtmlText({ defaultValue }).createInstance({ instanceKey, sendMessage })

  return { control, sendMessage }
}

const noFormats = { bold: false, italic: false, underline: false, strikethrough: false, link: null }

function editor(formats: HtmlTextFormats = noFormats) {
  return {
    focus: jest.fn(),
    setContent: jest.fn(),
    formats: jest.fn(() => formats),
    setFormat: jest.fn(),
    setLink: jest.fn(),
  }
}

describe('HtmlTextDefinition', () => {
  test('serializes with its own type and deserializes', () => {
    const visitor = new ClientMessagePortSerializationVisitor()
    const serialized = HtmlText({ label: 'Heading', defaultValue: '<b>Hi</b>' }).accept(visitor)
    visitor.getTransferables().forEach((port: any) => port.close())

    expect(serialized).toEqual({
      type: HtmlTextDefinition.type,
      config: { label: 'Heading', defaultValue: '<b>Hi</b>' },
    })

    const deserialized = deserializeUnifiedControlDef(
      deserializeRecord(serialized, [functionDeserializationPlugin]),
    )

    expect(deserialized).toBeInstanceOf(HtmlTextDefinition)
    expect((deserialized as HtmlTextDefinition).config.defaultValue).toBe('<b>Hi</b>')
  })

  test('reads the value as an HTML string', () => {
    const definition = HtmlText()
    const html = '<p>Fish &amp; <strong>chips</strong><br>now</p>'

    expect(definition.toText(html)).toBe('Fish & chips\nnow')
    expect(definition.getTranslatableData(html)).toBe(html)
    expect(definition.copyData(html, {} as any)).toBe(html)
    expect(definition.safeParse(html)).toEqual({ success: true, data: html })
    expect(definition.safeParse(1).success).toBe(false)
  })

  test('resolves to the saved HTML, or the default HTML', () => {
    const definition = HtmlText({ defaultValue: '<p>Default</p>' })

    expect(definition.resolveValue('<p>Hi</p>').readStable()).toBe('<p>Hi</p>')
    expect(definition.resolveValue(undefined).readStable()).toBe('<p>Default</p>')
  })

  test('a field with no saved value resolves to the default HTML on the client too', () => {
    const { control } = createControl('<p>Default</p>')

    expect(control.resolveData('<p>Saved</p>')).toBe('<p>Saved</p>')
    // No saved value, for example after an undo to the first state.
    expect(control.resolveData(undefined)).toBe('<p>Default</p>')
    expect(control.resolveData(null)).toBe('<p>Default</p>')
  })

  test('an edit is a client override, not a server render', () => {
    expect(createControl().control.resolvesToRenderableNode()).toBe(true)
  })
})

describe('HtmlTextControl', () => {
  test('keeps a FOCUS that comes before the editor mounts', () => {
    const { control } = createControl()
    const mounted = editor()

    control.recv({ type: HtmlTextControl.FOCUS })
    control.setEditor(mounted)

    expect(mounted.focus).toHaveBeenCalledTimes(1)
  })

  test('sends a local change and knows its echo', () => {
    const { control, sendMessage } = createControl()

    control.onLocalUserChange('<p>New</p>')

    expect(sendMessage).toHaveBeenCalledWith({
      type: HtmlTextControl.ON_CHANGE,
      value: '<p>New</p>',
    })
    expect(control.isEcho('<p>New</p>')).toBe(true)
    expect(control.isEcho('<p>Other</p>')).toBe(false)
  })

  test('an echo ends the wait for each older value', () => {
    const { control } = createControl()

    control.onLocalUserChange('<p>One</p>')
    control.onLocalUserChange('<p>Two</p>')

    expect(control.isEcho('<p>Two</p>')).toBe(true)
    // An undo to an older value is a change from the builder, not an echo.
    expect(control.isEcho('<p>One</p>')).toBe(false)
  })

  test('RESET_VALUE writes the default value', () => {
    const { control, sendMessage } = createControl('<p>Default</p>')
    const mounted = editor()

    control.setEditor(mounted)
    control.recv({ type: HtmlTextControl.RESET_VALUE })

    expect(mounted.setContent).toHaveBeenCalledWith('<p>Default</p>')
    expect(sendMessage).toHaveBeenCalledWith({
      type: HtmlTextControl.ON_CHANGE,
      value: '<p>Default</p>',
    })
  })

  test('sends the formats only when they change', () => {
    const { control, sendMessage } = createControl()

    control.setEditor(editor())
    control.updateFormats()

    expect(
      sendMessage.mock.calls.filter(([message]) => message.type === HtmlTextControl.FORMATS_CHANGE),
    ).toHaveLength(1)
  })

  test('sends the formats when the editor mounts', () => {
    const { control, sendMessage } = createControl()
    const formats = { ...noFormats, bold: true }

    control.setEditor(editor(formats))

    expect(sendMessage).toHaveBeenCalledWith({
      type: HtmlTextControl.FORMATS_CHANGE,
      formats,
    })
  })

  test('SET_FORMAT and SET_LINK change the editor', () => {
    const { control } = createControl()
    const mounted = editor()
    const link = { href: 'https://example.com', openInNewTab: true }

    control.setEditor(mounted)
    control.recv({ type: HtmlTextControl.SET_FORMAT, format: 'italic', on: true })
    control.recv({ type: HtmlTextControl.SET_LINK, link })

    expect(mounted.setFormat).toHaveBeenCalledWith('italic', true)
    expect(mounted.setLink).toHaveBeenCalledWith(link)
  })

  test('the panel changes the whole text without an editor, and the editor first', () => {
    const { control } = createControl()
    const wholeText = editor()
    const mounted = editor()
    const message = { type: HtmlTextControl.SET_FORMAT, format: 'bold', on: true } as const

    control.setWholeTextEditor(wholeText)
    control.recv(message)
    control.setEditor(mounted)
    control.recv(message)

    expect(wholeText.setFormat).toHaveBeenCalledTimes(1)
    expect(mounted.setFormat).toHaveBeenCalledTimes(1)
  })
})

describe('the link conversion', () => {
  test('reads and writes the links that HTML can hold', () => {
    const { linkToData, linkFromData } = HtmlTextControl

    expect(linkToData({ href: '/a', openInNewTab: true })).toEqual({
      type: 'OPEN_URL',
      payload: { url: '/a', openInNewTab: true },
    })
    expect(linkToData({ href: 'tel:123', openInNewTab: false })).toEqual({
      type: 'CALL_PHONE',
      payload: { phoneNumber: '123' },
    })
    expect(
      linkFromData({ type: 'SEND_EMAIL', payload: { to: 'a@b.co', subject: 'Hi there' } }),
    ).toEqual({ href: 'mailto:a@b.co?subject=Hi+there', openInNewTab: false })
    expect(linkFromData(null)).toBeNull()
    expect(
      linkFromData({ type: 'OPEN_PAGE', payload: { pageId: 'p', openInNewTab: false } }),
    ).toBeUndefined()
  })
})

import { RichTextV2Control } from '../control'
import { PageBuilderTextDefinition, PageBuilderTextControl } from '../page-builder'

const fakeEditor = () =>
  ({ children: [], currentKey: 'k', onChange: () => {}, focusAndSelectAll: jest.fn() }) as any

const definition = new PageBuilderTextDefinition({}, [])
const instance = (sendMessage = jest.fn()) =>
  definition.createInstance({ sendMessage } as any) as PageBuilderTextControl

const saves = (sendMessage: jest.Mock) =>
  sendMessage.mock.calls.filter(([message]) => message.type === RichTextV2Control.ON_CHANGE)

describe('PageBuilderTextControl', () => {
  test('is a RichText v2 control instance', () => {
    expect(instance()).toBeInstanceOf(RichTextV2Control)
  })

  test('keeps a FOCUS that came before the editor', () => {
    const control = instance()
    const editor = fakeEditor()

    control.recv({ type: RichTextV2Control.FOCUS })
    control.setEditor(editor)

    expect(editor.focusAndSelectAll).toHaveBeenCalledTimes(1)
  })

  test('drops a FOCUS after the editor unmounted', () => {
    const control = instance()
    const editor = fakeEditor()
    control.setEditor(editor)
    control.releaseEditor()

    control.recv({ type: RichTextV2Control.FOCUS })

    expect(editor.focusAndSelectAll).not.toHaveBeenCalled()
  })

  test('saves a change to the text, not a selection change', () => {
    const sendMessage = jest.fn()
    const control = instance(sendMessage)
    const editor = fakeEditor()
    control.setEditor(editor)

    editor.onChange({ operation: { type: 'set_selection' } })
    expect(saves(sendMessage)).toHaveLength(0)

    editor.onChange({ operation: { type: 'insert_text' } })
    expect(saves(sendMessage)).toHaveLength(1)
  })

  test('saves one time for each change after a second `setEditor`', () => {
    const sendMessage = jest.fn()
    const control = instance(sendMessage)
    const editor = fakeEditor()
    control.setEditor(editor)
    control.setEditor(editor)

    editor.onChange({ operation: { type: 'insert_text' } })

    expect(saves(sendMessage)).toHaveLength(1)
  })
})

describe('PageBuilderTextDefinition', () => {
  test('reads a string value as Page Builder HTML', () => {
    expect(() => definition.toText('Old <strong>heading</strong>' as any)).not.toThrow()
    expect(definition.introspect('Old heading' as any, { type: 'swatch' } as any)).toEqual([])
    expect(definition.copyData('<b>x</b>' as any, {} as any)).toMatchObject({
      descendants: [{ type: 'raw-html', html: '<b>x</b>' }],
    })
  })
})

/**
 * The default editor of `unstable_HtmlText`: HugeRTE, an MIT fork of TinyMCE 6.
 * It has no toolbar. The builder panel sets the formats and the links, as for
 * a RichText. The other settings keep the HTML of the element: paste adds
 * plain text, and no tag or attribute is removed.
 *
 * `HtmlText` loads this module with a dynamic import, in the builder only.
 * HugeRTE is about 360 KB (gzip) with its theme, icons, and skin.
 */
import { type Editor } from 'hugerte'
import isHotkey from 'is-hotkey'

import {
  type HtmlTextFormats,
  type HtmlTextPanelEditor,
  anchorLink,
  htmlTextFormats,
} from '../../../../controls/html-text'

import { type HtmlTextEditor, type HtmlTextEditorCallbacks } from './html-text'

type HugeRte = typeof import('hugerte').default

let loading: Promise<HugeRte> | null = null

/**
 * The theme, the model, the icons, the plugins, and the skin register
 * themselves on the global `hugerte`, so they load after the core.
 */
export function loadHugeRte(): Promise<HugeRte> {
  loading ??= (async () => {
    const { default: hugerte } = await import('hugerte')

    await Promise.all([
      import('hugerte/models/dom'),
      import('hugerte/themes/silver'),
      import('hugerte/icons/default'),
      import('hugerte/skins/ui/oxide/skin'),
      import('hugerte/skins/ui/oxide/content.inline'),
    ])

    return hugerte
  })()

  return loading
}

/** The settings of every editor. */
const BASE_SETTINGS = {
  inline: true,
  menubar: false,
  toolbar: false,
  contextmenu: false,
  // Paste adds no markup. Paste is in the core since TinyMCE 6.
  paste_as_text: true,
  // The skin comes from the imported `skin.js`. The page CSS styles the text.
  skin_url: 'default',
  content_css: false,
  // Keep the widget HTML as it is: no tag or attribute is removed.
  valid_elements: '*[*]',
} as const

/** The attributes of an element, to put back after the editor stops. */
function attributesOf(element: HTMLElement): Map<string, string> {
  return new Map(Array.from(element.attributes, attribute => [attribute.name, attribute.value]))
}

function restoreAttributes(element: HTMLElement, attributes: Map<string, string>) {
  Array.from(element.attributes).forEach(({ name }) => {
    if (!attributes.has(name)) {
      element.removeAttribute(name)
    }
  })
  attributes.forEach((value, name) => {
    element.setAttribute(name, value)
  })
}

/**
 * The format shortcuts. The panel sets the formats, so the keyboard does not.
 * `access+1` to `access+9` change the block, for example to a heading.
 */
const FORMAT_SHORTCUTS = [
  'meta+b',
  'meta+i',
  'meta+u',
  ...Array.from({ length: 9 }, (_, index) => `access+${index + 1}`),
]

/** The keys that the browser uses to format an editable element. */
const isBrowserFormatKey = isHotkey(['mod+b', 'mod+i', 'mod+u'])
const isRedo = isHotkey(['mod+shift+z', 'mod+y'])
const isUndo = isHotkey('mod+z')

/** The HugeRTE formats have the same names as the panel formats. */
function formatsOf(editor: Editor): HtmlTextFormats {
  const link = editor.dom.getParent<HTMLAnchorElement>(editor.selection.getStart(), 'a[href]')

  return htmlTextFormats(
    format => editor.formatter.match(format),
    link == null ? null : anchorLink(link),
  )
}

/** Starts HugeRTE on the element, with its current content. */
export async function mountHugeRte(
  element: HTMLElement,
  callbacks: HtmlTextEditorCallbacks,
): Promise<HtmlTextEditor> {
  const hugerte = await loadHugeRte()
  const attributes = attributesOf(element)

  const editors: Editor[] = await hugerte.init({
    ...BASE_SETTINGS,
    target: element,
    setup: (instance: Editor) => {
      instance.on('keydown', (event: KeyboardEvent) => {
        // The builder owns undo, so one undo stack holds every change.
        if (isRedo(event)) {
          event.preventDefault()
          callbacks.onRedo()
        } else if (isUndo(event)) {
          event.preventDefault()
          callbacks.onUndo()
        } else if (isBrowserFormatKey(event)) {
          // The RichText has no format shortcuts yet, so block them for the same UX.
          event.preventDefault()
        } else if (event.key === 'Escape') {
          callbacks.onEscape()
        }
      })
      // An undo that is not a key press, for example from the Edit menu of
      // the browser. Without this, the browser changes the text itself.
      instance.on(
        'beforeinput',
        (event: InputEvent) => {
          if (event.inputType === 'historyUndo') {
            event.preventDefault()
            callbacks.onUndo()
          } else if (event.inputType === 'historyRedo') {
            event.preventDefault()
            callbacks.onRedo()
          }
        },
        true,
      )
      instance.on('focus', () => callbacks.onFocus())
    },
  })

  const editor = editors.at(0)

  if (editor == null) {
    restoreAttributes(element, attributes)
    throw new Error('HugeRTE did not start')
  }

  FORMAT_SHORTCUTS.forEach(shortcut => editor.shortcuts.remove(shortcut))

  // HugeRTE parses the HTML again when it starts. That is not an edit, so
  // only a change from this content is saved.
  let lastHtml = editor.getContent()

  const save = () => {
    const html = editor.getContent()

    if (html !== lastHtml) {
      lastHtml = html
      callbacks.onChange(html)
    }
  }

  editor.on('input ExecCommand change', save)
  editor.on('NodeChange', () => callbacks.onFormatsChange())

  return {
    focus: () => {
      editor.focus()
      editor.selection.select(editor.getBody(), true)
    },
    setContent: html => {
      editor.setContent(html)
      lastHtml = editor.getContent()
    },
    formats: () => formatsOf(editor),
    setFormat: (format, on) => {
      if (on) {
        editor.formatter.apply(format)
      } else {
        editor.formatter.remove(format)
      }

      save()
    },
    setLink: link => {
      if (link == null) {
        editor.execCommand('unlink')
      } else {
        editor.execCommand('mceInsertLink', false, {
          href: link.href,
          target: link.openInNewTab ? '_blank' : null,
        })
      }

      save()
    },
    destroy: () => {
      editor.remove()
      // `remove` leaves `contenteditable`, a class, and maybe an `id`. The
      // host puts back the HTML of the value.
      restoreAttributes(element, attributes)
    },
  }
}

/**
 * The hidden editors for build mode, one for each tag name. The tag name of
 * the host decides how HugeRTE parses the content, for example if it adds a
 * `<p>`. So the hidden editor has the same tag name as the host.
 */
const hiddenEditors = new Map<string, Promise<Editor>>()

function hiddenEditor(tagName: string): Promise<Editor> {
  const key = tagName.toLowerCase()
  let editor = hiddenEditors.get(key)

  if (editor == null) {
    editor = (async () => {
      const hugerte = await loadHugeRte()
      const element = document.createElement(key)

      element.setAttribute('aria-hidden', 'true')
      element.style.cssText = 'position: fixed; top: 0; left: -10000px; width: 1px;'
      document.body.appendChild(element)

      const [instance] = (await hugerte.init({ ...BASE_SETTINGS, target: element })) as Editor[]
      if (instance == null) throw new Error('HugeRTE did not start')

      return instance
    })()

    editor.catch(() => hiddenEditors.delete(key))
    hiddenEditors.set(key, editor)
  }

  return editor
}

/** The text nodes that have text. HugeRTE can add zero-width characters. */
function textNodesOf(root: HTMLElement): Text[] {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text

    if (/[^\s\u200B\uFEFF]/.test(node.data)) nodes.push(node)
  }

  return nodes
}

/**
 * The formats of all the text. A format is on only if all the text has it.
 * `formatter.match` checks only the start of a selection, so check each text.
 */
function wholeTextFormatsOf(editor: Editor): HtmlTextFormats {
  const body = editor.getBody()
  const parents = textNodesOf(body).map(node => node.parentElement ?? body)
  const anchors = parents.map(parent => editor.dom.getParent<HTMLAnchorElement>(parent, 'a[href]'))
  const first = anchors.at(0)
  const link =
    first != null &&
    anchors.every(anchor => anchor?.getAttribute('href') === first.getAttribute('href'))
      ? anchorLink(first)
      : null

  return htmlTextFormats(
    format =>
      parents.length > 0 &&
      parents.every(parent => editor.formatter.match(format, undefined, parent)),
    link,
  )
}

/**
 * An editor for the whole text, without a selection. The panel uses it in
 * build mode, as for a Makeswift RichText: a format applies to all the text.
 *
 * A hidden HugeRTE editor does the change, so the host element does not
 * change until the value changes. The formats get a range of all the text,
 * not a selection, so the selection of the page does not change. The link
 * uses the same `link` format as the `mceInsertLink` command.
 */
export async function mountWholeTextEditor(
  host: HTMLElement,
  onChange: (html: string) => void,
): Promise<HtmlTextPanelEditor> {
  const editor = await hiddenEditor(host.tagName)

  /** Loads the HTML of the host, and returns a range of all of it. */
  const load = (): Range => {
    editor.setContent(host.innerHTML)
    editor.undoManager.clear()

    const range = editor.dom.createRng()
    range.selectNodeContents(editor.getBody())

    return range
  }

  const change = (apply: (range: Range) => void) => {
    apply(load())
    onChange(editor.getContent())
  }

  return {
    formats: () => {
      load()
      return wholeTextFormatsOf(editor)
    },
    setFormat: (format, on) =>
      change(range => {
        if (on) {
          editor.formatter.apply(format, undefined, range)
        } else {
          editor.formatter.remove(format, undefined, range)
        }
      }),
    setLink: link =>
      change(range => {
        editor.formatter.remove('link', undefined, range)

        if (link != null) {
          editor.formatter.apply(
            'link',
            { href: link.href, target: link.openInNewTab ? '_blank' : null },
            range,
          )
        }
      }),
  }
}

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

import { type HtmlTextFormats, anchorLink, htmlTextFormats } from '../../../../controls/html-text'

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
    target: element,
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

/* eslint-env browser */

import { useState, useEffect, useLayoutEffect, forwardRef, Ref, useImperativeHandle } from 'react'
import styled from 'styled-components'
import { cx } from '@emotion/css'

import { cssMargin } from '../../utils/cssMediaRules'
import { ElementIDValue, MarginValue, TextAreaValue } from '../../../prop-controllers/descriptors'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../react'

type Props = {
  id?: ElementIDValue
  html?: TextAreaValue
  width?: string
  margin?: MarginValue
}

const Container = styled.div<{ margin: Props['margin'] }>`
  min-height: 15px;
  ${cssMargin()}
`

const defaultHtml = `<div style="padding: 24px; background-color: rgba(161, 168, 194, 0.18); overflow: hidden;">
<svg width="316" height="168" viewBox="0 0 316 168" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="70" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="78" width="30" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="116" width="78" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect y="20" width="120" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="128" y="20" width="30" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="166" y="20" width="78" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect y="60" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="20" y="80" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="40" y="100" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="88" y="100" width="110" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="206" y="100" width="24" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="238" y="100" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="40" y="120" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="88" y="120" width="50" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="146" y="120" width="24" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="178" y="120" width="90" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.25"/>
<rect x="276" y="120" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect x="20" y="140" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
<rect y="160" width="40" height="8" rx="2" fill="#A1A8C2" fill-opacity="0.5"/>
</svg>
</div>`
const SCRIPT_TAG = 'script'

const Embed = forwardRef(function Embed(
  { id, width, margin, html = defaultHtml }: Props,
  ref: Ref<HTMLDivElement | null>,
) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useLayoutEffect(() => {
    setShouldRender(true)
  }, [])

  useImperativeHandle(ref, () => container, [container])

  useEffect(() => {
    // TODO: When we SSR the editor, we can remove the editor check
    // and not run this effect on the first render.
    if (!container) return

    const walker = container.ownerDocument.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node: Element) {
        return node.tagName.toLowerCase() === SCRIPT_TAG
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      },
    })

    const nodes: Element[] = []

    while (walker.nextNode()) nodes.push(walker.currentNode as Element)

    // By default scripts appended dynamically will execute asyncrhonously. Here we ensure that
    // scripts are loaded synchronously since that's what a user usually expects with scripts in
    // embedded in HTML which usually comes from the server.
    //
    // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#notes
    async function executeScriptsInOrder() {
      for (let i = 0; i < nodes.length; i++) {
        await new Promise<void>(resolve => {
          const node = nodes[i]
          const script = node.ownerDocument.createElement(SCRIPT_TAG)

          script.textContent = node.textContent
          Array.from(node.attributes).forEach(({ name, value }) => {
            script.setAttribute(name, value)
          })

          script.onload = () => resolve()
          script.onerror = () => resolve()

          node.parentNode?.insertBefore(script, node)
          node.parentNode?.removeChild(node)

          if (!script.hasAttribute('src')) resolve()
        })
      }
    }

    executeScriptsInOrder().catch(error => {
      // Ignore errors from user-provided code
      console.error(error)
    })
  }, [container, html])

  if (shouldRender === false) return null

  return (
    <Container
      ref={setContainer}
      id={id}
      className={cx(width)}
      margin={margin}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})

export default Embed

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(Embed, {
    type: './components/Embed/index.js',
    label: 'Embed',
    icon: 'Code40',
    props: {
      id: Props.ElementID(),
      html: Props.TextArea({ label: 'Code', rows: 20 }),
      width: Props.Width(),
      margin: Props.Margin(),
    },
  })
}

import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import path from 'path'
import { Writable } from 'stream'
import { Region } from './makeswift/Region'
import { EDITOR_PROPS_NAMESPACE } from './client'
import { client } from './makeswift/client'
import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())

app.use('/static', express.static(path.join(__dirname, '../dist')))

app.get('/api/makeswift/manifest', (req, res) => {
  res.json({
    version: '0.24.5',
    previewMode: true,
    draftMode: false,
    interactionMode: true,
    clientSideNavigation: false,
    elementFromPoint: false,
    customBreakpoints: true,
    siteVersions: true,
    unstable_siteVersions: true,
    localizedPageSSR: true,
    webhook: true,
    localizedPagesOnlineByDefault: true,
  })
})

app.get('*', async (req, res) => {
  try {
    const targetUrl = `https://en.wikipedia.org${req.path}`

    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data)

    // Rewrite relative URLs to absolute URLs
    const rewriteUrls = (selector: string, attr: string) => {
      $(selector).each((_, elem) => {
        const url = $(elem).attr(attr)
        if (url?.startsWith('//')) {
          $(elem).attr(attr, `https:${url}`)
        } else if (url?.startsWith('/')) {
          $(elem).attr(attr, `https://en.wikipedia.org${url}`)
        }
      })
    }

    rewriteUrls('link[href]', 'href')
    rewriteUrls('script[src]', 'src')
    rewriteUrls('img[src]', 'src')

    const editorRegionId = 'visual-editor-region'

    // Replace the vector-body-before-content div
    const targetDiv = $('.vector-body-before-content')
    if (targetDiv.length) {
      targetDiv.attr('id', editorRegionId)
    }

    let targetElement = $(`#${editorRegionId}`)

    if (targetElement.length) {
      const initialContent = targetElement.html() || ''

      const snapshot = await client.getComponentSnapshot(req.path, {
        siteVersion: 'Working',
      })
      const { cache, flush } = createRootStyleCache({ key: 'mswft' })

      const editorProps = {
        regionId: editorRegionId,
        snapshot,
        label: `Region ${req.path}`,
        previewMode: true,
      }

      // Use renderToPipeableStream to handle Suspense and wait for all data
      const editorHtml = await new Promise<string>((resolve, reject) => {
        let html = ''
        const { pipe } = renderToPipeableStream(
          <RootStyleRegistry cache={cache}>
            <Region {...editorProps} />
          </RootStyleRegistry>,
          {
            onAllReady() {
              // Create a writable stream to collect the HTML
              const chunks: Buffer[] = []
              const writable = new Writable({
                write(chunk: Buffer, encoding: string, callback: () => void) {
                  chunks.push(chunk)
                  callback()
                },
              })

              writable.on('finish', () => {
                html = Buffer.concat(chunks).toString()
                resolve(html)
              })

              pipe(writable)
            },
            onError(error) {
              reject(error)
            },
          },
        )
      })

      // Replace the target element with the rendered content
      targetElement.html(editorHtml)

      // Inject emotion styles into the head after rendering
      const names = flush()
      if (names.length > 0) {
        let css = ''
        for (const n of names) css += cache.inserted[n]
        $('head').append(styleTag(cache.key, names, css))
      }

      const hydrationScript = `
        <script>
          window['${EDITOR_PROPS_NAMESPACE}'] = ${JSON.stringify(editorProps)};
        </script>
        <script src="/static/client.js"></script>
      `

      $('body').append(hydrationScript)
    }

    res.send($.html())
  } catch (error) {
    console.error('Proxy error for path', req.path)
    res.status(500).send('Proxy error')
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`)
})

/* helper to build a <style> tag */
function styleTag(key: string, names: string[], css: string) {
  return `<style data-emotion="${key} ${names.join(' ')}">${css}</style>`
}

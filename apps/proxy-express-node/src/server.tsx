import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import path from 'path'
import { Writable } from 'stream'
import { Region } from './makeswift/Region'
import { client } from './makeswift/client'
import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { convertAllUrlsToHttpsAndAbsolute } from './utils/convert-urls-to-https-and-absolute'
import {
  getSiteVersion,
  isDraftModeEnabled,
  draftModeMiddleware,
} from './makeswift/draft'
import './makeswift/components'
import { makeswiftApiHandlerMiddleware } from './makeswift/api-handler'
import {
  HOST,
  HYDRATION_PROPS_NAMESPACE,
  TARGET_ELEMENT_SELECTOR,
} from './makeswift/constants'
import {
  extractMetadataFromHtml,
  removeExistingMetaTags,
} from './utils/metadata-extractor'
import { flushAndBuildStyles } from './makeswift/emotion-styles'
import { buildHydrationScript } from './utils/hydration-script'
import { renderHtml } from './utils/render-html'

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, '../dist')))

app.use(makeswiftApiHandlerMiddleware)
app.use(draftModeMiddleware)

app.get('*', async (req, res) => {
  try {
    const [hostResponse, snapshot] = await Promise.all([
      axios.get(`${HOST}${req.path}`),
      client.getComponentSnapshot(req.path, {
        siteVersion: getSiteVersion(req),
      }),
    ])

    const $ = cheerio.load(hostResponse.data)
    convertAllUrlsToHttpsAndAbsolute($, HOST)
    let targetElement = $(TARGET_ELEMENT_SELECTOR)
    if (targetElement.length === 0) return res.send($.html())

    const { cache, flush } = createRootStyleCache({ key: 'mswft' })
    const props = {
      snapshot,
      label: `Region ${req.path}`,
      previewMode: isDraftModeEnabled(req),
    }
    const elementHtml = await renderHtml(
      <RootStyleRegistry cache={cache}>
        <Region {...props} />
      </RootStyleRegistry>,
    )

    const {
      metadataTags,
      bodyHtml: elementBody,
      headHtml: elementHead,
    } = extractMetadataFromHtml(elementHtml)
    const emotionStyles = flushAndBuildStyles(cache, flush)
    const hydrationScript = buildHydrationScript(
      HYDRATION_PROPS_NAMESPACE,
      props,
    )
    removeExistingMetaTags($, metadataTags)

    if (elementHead) $('head').append(elementHead)
    if (emotionStyles) $('head').append(emotionStyles)
    targetElement.empty().append(elementBody)
    $('body').append(hydrationScript)

    res.send($.html())
  } catch (error) {
    console.error('Proxy error for path', req.path)
    res.status(500).send('Proxy error')
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`)
})

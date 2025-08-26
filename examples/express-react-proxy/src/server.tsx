import { strict } from 'node:assert'

import express from 'express'
import * as cheerio from 'cheerio'
import React, { type ComponentProps } from 'react'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {
  createApiHandler,
  createPreviewMiddleware,
  getSiteVersion,
  renderHtml,
} from '@makeswift/express-react/server'

import { client } from './makeswift/client'
import { EditableRegion } from './makeswift/editable-region'
import { MAKESWIFT_SITE_API_KEY } from './makeswift/env'
import { hydrationScript } from './makeswift/hydration'
import { runtime } from './makeswift/runtime'

import { convertAllUrlsToHttpsAndAbsolute } from './lib/convert-urls-to-https-and-absolute'
import {
  extractMetadataFromHtml,
  removeExistingMetaTags,
} from './lib/metadata-extractor'

import './makeswift/components'

strict(
  process.env.HOST,
  'Set the `HOST` environment variable to the site you want to proxy.',
)
strict(
  process.env.ELEMENT_SELECTOR,
  'Set the `ELEMENT_SELECTOR` environment variable to the selector for the element you want to edit.',
)

const HOST = process.env.HOST
const ELEMENT_SELECTOR = process.env.ELEMENT_SELECTOR

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, '../dist')))

app.use(createApiHandler(MAKESWIFT_SITE_API_KEY, { runtime }))
app.use(createPreviewMiddleware({ client }))

app.get('*', async (req, res) => {
  const siteVersion = await getSiteVersion(req)

  try {
    const [hostResponse, snapshot] = await Promise.all([
      fetch(`${process.env.HOST}${req.path}`),
      client.getComponentSnapshot(req.path, {
        siteVersion,
      }),
    ])

    if (
      !hostResponse.ok ||
      !hostResponse.headers.get('content-type')?.startsWith('text/html')
    ) {
      return res.status(hostResponse.status).send(await hostResponse.text())
    }

    const hostHtml = await hostResponse.text()

    const $ = cheerio.load(hostHtml)
    let targetElement = $(ELEMENT_SELECTOR)
    if (targetElement.length === 0) {
      return res.send(hostHtml)
    }

    convertAllUrlsToHttpsAndAbsolute($, HOST)

    const regionProps: ComponentProps<typeof EditableRegion> = {
      snapshot,
      siteVersion,
      label: `${req.path}`,
    }

    const { html: regionHtml, getStyles: getRegionStyles } = await renderHtml(
      <EditableRegion {...regionProps} />,
    )

    const {
      metadataTags,
      bodyHtml: regionBody,
      headHtml: regionHead,
    } = extractMetadataFromHtml(regionHtml)

    removeExistingMetaTags($, metadataTags)

    if (regionHead) $('head').append(regionHead)
    $('head').append(getRegionStyles())

    targetElement.empty().append(regionBody)
    $('body').append(
      hydrationScript({
        regionProps,
        selector: ELEMENT_SELECTOR,
      }),
    )

    res.send($.html())
  } catch (error) {
    console.error(`Proxy error for path: ${req.path}`, error)
    res.status(500).send('Proxy error')
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`)
})

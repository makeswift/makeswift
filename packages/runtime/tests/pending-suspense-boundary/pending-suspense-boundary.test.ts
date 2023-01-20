import { test, expect } from 'vitest'
import { promisify } from 'util'
import { promises as fs } from 'fs'
import { JSDOM } from 'jsdom'

const exec = promisify(require('child_process').exec)
const fiveMinutes = 5 * 60 * 1000

test(
  'Ensure no pending suspense boundary on the generated HTML',
  async () => {
    await exec('cd tests/pending-suspense-boundary && next build')

    const buildPath = './tests/pending-suspense-boundary/.next/server/pages/index.html'
    const htmlString = await fs.readFile(buildPath)

    const dom = new JSDOM(htmlString, { url: 'http://localhost' })
    const pendingSuspenseBoundary = dom.window.document.querySelector('#__next template')

    expect(pendingSuspenseBoundary).toBeNull()
  },
  fiveMinutes,
)

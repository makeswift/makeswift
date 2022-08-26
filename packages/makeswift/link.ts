import * as path from 'path'
import isNextApp from './isNextApp'

async function link(name: string): Promise<void> {
  const appDirectory = name ? path.join(__dirname, name) : path.join(__dirname)

  if (isNextApp(appDirectory)) {
    console.log('linking app')
  } else {
    console.log('Did not detect a Next.js application.')
  }
}

export default link

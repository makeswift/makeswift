import * as fs from 'fs'
import { instanceOfNodeError } from './is-node-error'

export function createFolderIfNotExists(folder: string) {
  try {
    fs.mkdirSync(folder)
  } catch (err) {
    if (err instanceof Error) {
      if (instanceOfNodeError(err, TypeError)) {
        if (err.code === 'EEXIST') {
          // do nothing
          return
        }

        throw err
      }
    }
  }
}

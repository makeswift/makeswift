import chalk from 'chalk'
import * as glob from 'glob'
import MakeswiftError from '../errors/MakeswiftError'

const CONFLICTING_FILES = [
  'pages/api/makeswift.*',
  'pages/api/makeswift/**/*',
  'pages/[*].*',
  'pages/_document.*',
]
function containsConflictingFiles({ dir }: { dir: string }): string[] {
  return CONFLICTING_FILES.map(file => ({ path: `${dir}/${file}`, name: file }))
    .map(({ path }) => glob.sync(path))
    .reduce((prev, curr) => prev.concat(...curr), [])
}

export function checkForConflictingFiles({ dir }: { dir: string }): void {
  const conflictingFiles = containsConflictingFiles({ dir })

  if (conflictingFiles.length > 0) {
    throw new MakeswiftError(formatErrorMessage({ dir, files: conflictingFiles }))
  }
}

function formatErrorMessage({ dir, files }: { dir: string; files: string[] }): string {
  const relativeFiles = files.map(file => file.split(`${dir}/`)[1])

  const uniqueFilesOrFolders = Array.from(new Set(relativeFiles))

  const directoryName = dir.split('/').slice(-1)[0]

  const prettyFiles = uniqueFilesOrFolders
    .map(fileOrFolder => `  ${chalk.dim(fileOrFolder)}`)
    .join('\n')

  return `The directory ${chalk.green(
    directoryName,
  )} contains files that could conflict:\n\n${prettyFiles}\n\nYou will need to use a different directory or integrate manually. Read our docs for more info: ${chalk.blue(
    'https://www.makeswift.com/docs/guides/manual-setup',
  )}`
}

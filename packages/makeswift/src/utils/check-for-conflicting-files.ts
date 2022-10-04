import * as glob from 'glob'

const CONFLICTING_FILES = ['pages/api/makeswift.*', 'pages/[...path].*', 'pages/_document.*']
export function checkForConflictingFiles({ dir }: { dir: string }): string[] {
  return CONFLICTING_FILES.map(file => ({ path: `${dir}/${file}`, name: file }))
    .map(({ path }) => glob.sync(path))
    .reduce((prev, curr) => prev.concat(...curr), [])
}

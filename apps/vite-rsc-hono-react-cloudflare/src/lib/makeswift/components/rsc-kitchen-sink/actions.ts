'use server'

import { markdownFiles } from './server'

// Called by the builder via a `Combobox`'s `getOptions`
export const getMarkdownFileList = async () => Object.keys(markdownFiles)

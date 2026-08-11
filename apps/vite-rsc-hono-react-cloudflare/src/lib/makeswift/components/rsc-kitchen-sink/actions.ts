'use server'

import { markdownFiles } from './server'

// Called by the builder
export const getMarkdownFileList = async () => Object.keys(markdownFiles)

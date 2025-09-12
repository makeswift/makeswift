import { runtime } from '@/makeswift/runtime'
import { RscMarkdownRegistration } from './rsc-markdown.registration'
import { RscMarkdown } from './rsc-markdown'

runtime.registerComponent(RscMarkdown, RscMarkdownRegistration)

import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Style,
  unstable_Code as Code,
  type CodeLanguage,
} from '@makeswift/runtime/controls'

const webLanguages: CodeLanguage[] = ['html', 'css']
const backendLanguages: CodeLanguage[] = [
  'typescript',
  'python',
  'go',
  'java',
  'cpp',
]

runtime.registerComponent(
  lazy(() => import('./code-demo')),
  {
    type: 'Code Control Demo',
    label: 'Custom / Code Control Demo',
    props: {
      className: Style(),
      htmlCode: Code({
        label: 'HTML',
        languages: webLanguages,
        defaultValue: '<div>Hello, world!</div>',
      }),
      cssCode: Code({
        label: 'CSS',
        languages: ['css'],
      }),
      tsCode: Code({
        label: 'TypeScript',
        languages: ['typescript'],
        defaultValue: 'const greeting: string = "hello"',
      }),
      multiCode: Code({
        label: 'Multi-language',
        languages: backendLanguages,
      }),
    },
  },
)

import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, unstable_Code as Code } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./code-demo')),
  {
    type: 'Code Control Demo',
    label: 'Custom / Code Control Demo',
    props: {
      className: Style(),
      htmlCode: Code({
        label: 'HTML',
        languages: ['html'],
        defaultValue: '<div>Hello, world!</div>',
      }),
      cssCode: Code({
        label: 'CSS',
        languages: ['css'],
      }),
      tsCode: Code({
        label: 'TypeScript',
        languages: ['typescript', 'javascript'],
        defaultValue: 'const greeting: string = "hello"',
      }),
      bashCode: Code({
        label: 'Bash',
        languages: ['bash'],
        defaultValue: 'echo "Hello, world!"',
      }),
    },
  },
)

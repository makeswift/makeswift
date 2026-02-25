import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Code } from '@makeswift/runtime/controls'

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
      jsCode: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode1: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode2: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode3: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode4: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode5: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode6: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode7: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode8: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
      jsCode9: Code({
        label: 'Multi-language',
        languages: ['javascript', 'typescript', 'json'],
      }),
    },
  },
)

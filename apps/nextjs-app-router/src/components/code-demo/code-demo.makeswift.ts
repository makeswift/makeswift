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
        defaultValue: `<article class="card">
  <h2>Hello, world!</h2>
  <p>A small demo of the Code control.</p>
  <button type="button">Click me</button>
</article>`,
      }),
      cssCode: Code({
        label: 'CSS',
        defaultValue: `.card {
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #ec4899);
  color: white;
}`,
      }),
      tsCode: Code({
        label: 'TypeScript',
        defaultValue: `type Greeting = { name: string; lang: 'en' | 'es' }

function greet({ name, lang }: Greeting): string {
  const hello = lang === 'es' ? 'Hola' : 'Hello'
  return \`\${hello}, \${name}!\`
}`,
      }),
      bashCode: Code({
        label: 'Bash',
        defaultValue: `#!/usr/bin/env bash
set -euo pipefail

for file in *.md; do
  echo "Processing $file..."
done`,
      }),
    },
  },
)

---
'@makeswift/runtime': patch
---

Add `RootStyleRegistry` component. This component provides support for Makeswift's CSS-in-JS runtime in Next.js' App Router.

For example, in `app/layout.tsx`:

```tsx
import { RootStyleRegistry } from '@makeswift/runtime/next'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}
```

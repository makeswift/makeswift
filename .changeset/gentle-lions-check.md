---
'@makeswift/runtime': minor
---

BREAKING: Replace Vite with tsup. The build script now transpiles source files instead of bundling them to preserve `'use client'` directives for Next.js App Router support.

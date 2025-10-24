---
'@makeswift/next-plugin': patch
---

fix: only add webpack config if `resolveSymlinks` is not null

Next.js v16 uses Turbopack by default, which throws an error when a webpack config is present and no Turbopack config is present.

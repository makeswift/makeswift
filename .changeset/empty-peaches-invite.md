---
'makeswift': patch
---

Fix issue where handshake would hang forever if Yarn wasn't installed. We now detect package managers and use either npm, Yarn, or pnpm, depending on which one was detected.

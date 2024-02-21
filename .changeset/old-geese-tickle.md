---
'@makeswift/runtime': patch
---

If `useRouter` is used within the App Router it'll throw an error as it can't be used there. This wraps the `useRouter` usage in a try/catch to conditional return `undefined` if we can't use it. We will probably use a different method of syncing the current locale in the App Router, so for now, noop this effect.

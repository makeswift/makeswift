---
'@makeswift/runtime': patch
---

fix: change the default Emotion cache key from `css` to `mswft` to reduce the risk of conflicts with the host's code; allow overriding the key by passing the `cacheKey` prop to `<RootStyleRegistry />`.

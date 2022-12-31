---
'@makeswift/runtime': minor
---

BREAKING CHANGE: This change completely reworks how the runtime fetches Makeswift API resources like swatches, files, typographies, etc. While behavior of components shouldn't change, and we've tested extensively, it's possible there's slight behavior changes in certain edge cases or there's old behavior that Apollo had that we didn't want to replicate.

This change removes @apollo/client as a dependency in favor of a very slim and efficient API client and cache custom built for the Makeswift runtime. This change resulted in a reduction of ~300ms from Total Blocking Time and ~700ms from Time to Interactive in our benchmarks. This is part of our ongoing work to make the Makeswift runtime more lightweight to reduce the cost of React hydration. Expect even more changes soon!

To migrate, just upgrade to the latest version. No public APIs have changed.

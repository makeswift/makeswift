---
'@makeswift/runtime': patch
---

Add a `Suspense` boundary around all element data. This is a _huge_ performance boost due to how React schedules hydration tasks. With this change your Makeswift pages should score in the high 90s for Lighthouse performance benchmarks.

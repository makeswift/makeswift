---
'@makeswift/runtime': minor
---

BREAKING: Prior to this version the `Text` component and `RichText` control used `white-space-collapse: preserve` within app.makeswift.com and `white-space-collapse: collapse` within the live page.
Our goal is to exactly match what you see in Makeswift with what you see in the live page. 
This updates the live version to also `preserve` white space.

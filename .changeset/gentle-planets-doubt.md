---
'@makeswift/runtime': patch
---

Add console warning when `runtime` prop is passed to the `Page` component. 
`runtime` should now be passed to the `ReactRuntimeProvider` instead of to `Page`. 

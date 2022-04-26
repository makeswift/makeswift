---
"@makeswift/runtime": patch
---

Revert change that used `react-is` to detect when to forward ref.

Unfortunately using `react-is` won't work since `isForwardRef` doesn't give the correct result is the component uses `React.memo`, `React.lazy`, or similar variants. Also, `react-is` would need to be a peer dependency, increasing the integration burden.

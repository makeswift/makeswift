import { useEffect, useLayoutEffect } from 'react'

const isSSR =
  typeof window === 'undefined' ||
  /ServerSideRendering/.test(window.navigator && window.navigator.userAgent)

export const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect

import { useState, useRef, useCallback, ReactNode, CSSProperties } from 'react'
import clamp from '../../../../../utils/clamp'
import { useIsomorphicLayoutEffect } from '../../../../hooks/useIsomorphicLayoutEffect'

function isScrollable(element: HTMLElement) {
  const { overflow, overflowY, overflowX } =
    element.ownerDocument.defaultView!.getComputedStyle(element)

  return /(auto|scroll)/.test(overflow + overflowX + overflowY)
}

function getScrollParent(element: HTMLElement): HTMLElement {
  const { parentElement } = element

  if (!element || !parentElement) return element

  if (isScrollable(element)) return element

  return getScrollParent(parentElement)
}

type Props = {
  strength: number | null | undefined
  children: (
    getParallaxProps: <P extends { style?: CSSProperties; [key: string]: unknown }>(props: P) => P,
  ) => ReactNode
}

export default function Parallax({ strength, children, ...rest }: Props): JSX.Element {
  const container = useRef<HTMLDivElement>(null)
  const [containerScrollTop, setContainerScrollTop] = useState(strength == null ? 0 : strength)
  const lastScrollParentScrollTop = useRef(0)

  useIsomorphicLayoutEffect(() => {
    if (!container.current || strength == null || strength === 0) return undefined

    const containerDocument = container.current.ownerDocument
    const scrollParent = getScrollParent(container.current)
    const eventTarget =
      containerDocument.documentElement === scrollParent
        ? containerDocument.defaultView!
        : scrollParent

    lastScrollParentScrollTop.current = scrollParent.scrollTop
    setContainerScrollTop(strength)

    function handleScroll() {
      containerDocument.defaultView!.requestAnimationFrame(() => {
        if (!container.current) return

        const { top: containerTop, bottom: containerBottom } =
          container.current.getBoundingClientRect()
        const { top: scrollParentTop, bottom: scrollParentBottom } =
          scrollParent === containerDocument.documentElement
            ? { top: 0, bottom: containerDocument.defaultView!.innerHeight }
            : scrollParent.getBoundingClientRect()
        const { scrollTop: scrollParentScrollTop } =
          scrollParent === containerDocument.documentElement
            ? { scrollTop: containerDocument.defaultView!.pageYOffset }
            : scrollParent
        const scrollParentHeight = scrollParentBottom - scrollParentTop
        const scrollParentScrollDelta = scrollParentScrollTop - lastScrollParentScrollTop.current

        lastScrollParentScrollTop.current = scrollParentScrollTop

        setContainerScrollTop(scrollTop => {
          const isContainerVisible =
            containerTop < scrollParentTop + scrollParentHeight && containerBottom > scrollParentTop
          const containerScrollRemaining =
            scrollParentScrollDelta > 0 ? 2 * strength! - scrollTop : scrollTop
          const scrollParentScrollRemaining =
            scrollParentScrollDelta > 0
              ? scrollParentTop + containerBottom
              : scrollParentHeight - containerTop
          const parallaxRatio = containerScrollRemaining / scrollParentScrollRemaining
          const containerScrollDelta = isContainerVisible
            ? parallaxRatio * scrollParentScrollDelta
            : 0

          return clamp(0, scrollTop + containerScrollDelta, strength! * 2)
        })
      })
    }

    eventTarget.addEventListener('scroll', handleScroll)

    return () => eventTarget.removeEventListener('scroll', handleScroll)
  }, [strength])

  const getProps = useCallback(
    ({ style, ...restOfChildrenProps }) => ({
      ...restOfChildrenProps,
      style: {
        ...style,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        ...(strength == null || strength === 0
          ? {}
          : {
              top: -strength,
              bottom: -strength,
              transform: `translate3d(0, ${containerScrollTop - strength}px, 0)`,
            }),
      },
    }),
    [strength, containerScrollTop],
  )

  return (
    <div
      {...rest}
      ref={container}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {children(getProps)}
    </div>
  )
}

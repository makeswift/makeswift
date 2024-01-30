'use client'

import { CSSObject } from '@emotion/css'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ResponsiveNumberValue,
  ResponsiveSelectValue,
  ResponsiveValue,
} from '../../../prop-controllers'
import { useStyle } from '../../../runtimes/react/use-style'
import { useMediaQuery } from '../../hooks'
import { gridItemIdentifierClassName } from '../../shared/grid-item'
import {
  BoxAnimateIn,
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_BOX_ANIMATE_TYPE,
  DEFAULT_ITEM_ANIMATE_TYPE,
  DEFAULT_ITEM_STAGGER_DURATION,
} from './constants'

function useElementOnScreen(
  options: IntersectionObserverInit,
): [boolean, (element: HTMLElement | null) => void] {
  const [isVisible, setIsVisible] = useState(false)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)

  const setElement = useCallback((element: HTMLElement | null) => {
    if (element != null) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      }, options)

      observer.observe(element)

      intersectionObserverRef.current = observer
    } else {
      intersectionObserverRef.current?.disconnect()

      intersectionObserverRef.current = null
    }
  }, [])

  return [isVisible, setElement]
}

export type BoxAnimationProps = {
  boxAnimateType?: ResponsiveSelectValue<BoxAnimateIn>
  boxAnimateDuration?: ResponsiveNumberValue
  boxAnimateDelay?: ResponsiveNumberValue
  itemAnimateType?: ResponsiveSelectValue<BoxAnimateIn>
  itemAnimateDuration?: ResponsiveNumberValue
  itemAnimateDelay?: ResponsiveNumberValue
  itemStaggerDuration?: ResponsiveNumberValue
}

function compareResponsiveValues<T>(a?: ResponsiveValue<T>, b?: ResponsiveValue<T>) {
  if (a == null && b == null) {
    return true
  }
  if (a != null && b != null) {
    let isEqual = true
    a.forEach((currentA, index) => {
      const currentB = b.at(index)
      if (currentB == null) {
        isEqual = false
        return
      }

      if (currentA.deviceId != currentB?.deviceId || currentA.value != currentB.value) {
        isEqual = false
      }
    })
    return isEqual
  }

  return false
}

export function areBoxAnimationPropsEqual(prevProps: BoxAnimationProps, props: BoxAnimationProps) {
  return (
    compareResponsiveValues(prevProps.boxAnimateType, props.boxAnimateType) &&
    compareResponsiveValues(prevProps.boxAnimateDuration, props.boxAnimateDuration) &&
    compareResponsiveValues(prevProps.boxAnimateDelay, props.boxAnimateDelay) &&
    compareResponsiveValues(prevProps.itemAnimateType, props.itemAnimateType) &&
    compareResponsiveValues(prevProps.itemAnimateDuration, props.itemAnimateDuration) &&
    compareResponsiveValues(prevProps.itemAnimateDelay, props.itemAnimateDelay) &&
    compareResponsiveValues(prevProps.itemStaggerDuration, props.itemStaggerDuration)
  )
}

const exitedBoxAnimationProperties: { [key in BoxAnimateIn]: CSSObject } = {
  none: { opacity: 1 },
  fadeIn: { opacity: 0 },
  fadeLeft: { transform: 'translate3d(60px,0,0)', opacity: 0 },
  fadeRight: { transform: 'translate3d(-60px,0,0)', opacity: 0 },
  fadeDown: { transform: 'translate3d(0,-80px,0)', opacity: 0 },
  fadeUp: { transform: 'translate3d(0,80px,0)', opacity: 0 },
  blurIn: { filter: 'blur(20px)', opacity: 0 },
  scaleDown: {
    transform: 'scale(1.2)',
    opacity: 0,
  },
  scaleUp: {
    transform: 'scale(.75)',
    opacity: 0,
  },
}

const enteredBoxAnimationProperties: { [key in BoxAnimateIn]: CSSObject } = {
  none: { opacity: 1 },
  fadeIn: { opacity: 1 },
  fadeLeft: { transform: 'translate3d(0px,0,0)', opacity: 1 },
  fadeRight: { transform: 'translate3d(0px,0,0)', opacity: 1 },
  fadeDown: { transform: 'translate3d(0,0px,0)', opacity: 1 },
  fadeUp: { transform: 'translate3d(0,0px,0)', opacity: 1 },
  blurIn: { filter: 'blur(0px)', opacity: 1 },
  scaleDown: {
    transform: 'scale(1)',
    opacity: 1,
  },
  scaleUp: {
    transform: 'scale(1)',
    opacity: 1,
  },
}

export function useBoxAnimation(
  responsiveAnimationType: ResponsiveValue<BoxAnimateIn> | undefined,
  responsiveDuration: ResponsiveValue<number> | undefined,
  responisveDelay: ResponsiveValue<number> | undefined,
  itemResponsiveAnimationType: ResponsiveValue<BoxAnimateIn> | undefined,
): [string, () => void, (element: HTMLElement | null) => void] {
  const [isVisible, setElement] = useElementOnScreen({
    root: null,
    rootMargin: `0px 0px -10% 0px`,
    threshold: 0.2,
  })
  const animationType = useMediaQuery(responsiveAnimationType) || DEFAULT_BOX_ANIMATE_TYPE
  const itemAnimationType = useMediaQuery(itemResponsiveAnimationType) || DEFAULT_ITEM_ANIMATE_TYPE
  const duration = useMediaQuery(responsiveDuration) || DEFAULT_BOX_ANIMATE_DURATION
  const delay = useMediaQuery(responisveDelay) || DEFAULT_BOX_ANIMATE_DELAY
  const actualDelay = delay * 1000
  const actualDuration = duration * 1000

  const entered = {
    ...enteredBoxAnimationProperties[animationType],
    transition: `transform ${actualDuration}ms cubic-bezier(0.16, 0.84, 0.44, 1) ${actualDelay}ms,filter ${actualDuration}ms cubic-bezier(0.16, 0.84, 0.44, 1) ${actualDelay}ms, opacity ${actualDuration}ms ease ${actualDelay}ms`,
    [`& > div > .${gridItemIdentifierClassName}`]: {
      ...enteredBoxAnimationProperties[itemAnimationType],
    },
  }

  const exited = {
    ...exitedBoxAnimationProperties[animationType],
    transition: `all 0ms`,
    [`& > div > .${gridItemIdentifierClassName}`]: {
      ...exitedBoxAnimationProperties[itemAnimationType],
    },
  }

  const [isEntered, setEntered] = useState(false)

  useEffect(() => {
    if (isVisible && !isEntered) setEntered(true)
  }, [isVisible, entered])

  const replayAnimation = useCallback(() => {
    setEntered(false)
  }, [])

  return [
    useStyle({
      '@media (prefers-reduced-motion: no-preference)': isEntered ? entered : exited,
    }),
    replayAnimation,
    setElement,
  ]
}

export function useItemAnimation(
  responsiveDuration: ResponsiveValue<number> | undefined,
  responisveDelay: ResponsiveValue<number> | undefined,
  responsiveStagger: ResponsiveValue<number> | undefined,
  index: number,
) {
  const duration = useMediaQuery(responsiveDuration) || DEFAULT_BOX_ANIMATE_DURATION
  const delay = useMediaQuery(responisveDelay) || DEFAULT_BOX_ANIMATE_DELAY
  const stagger = useMediaQuery(responsiveStagger) || DEFAULT_ITEM_STAGGER_DURATION
  const delayFromStagger = responsiveStagger == null || index == null ? 0 : stagger * index
  const actualDelay = (delay + delayFromStagger) * 1000
  const actualDuration = duration * 1000

  return useStyle({
    '@media (prefers-reduced-motion: no-preference)': {
      transition: `transform ${actualDuration}ms cubic-bezier(0.16, 0.84, 0.44, 1) ${actualDelay}ms,filter ${actualDuration}ms cubic-bezier(0.16, 0.84, 0.44, 1) ${actualDelay}ms, opacity ${actualDuration}ms ease ${actualDelay}ms`,
    },
  })
}

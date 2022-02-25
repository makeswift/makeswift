import {
  TargetAndTransition,
  Transition,
  useAnimation,
  useReducedMotion,
  Variants,
  MotionProps,
} from 'framer-motion'
import { TransitionMap } from 'framer-motion/types/types'
import { useCallback, useEffect, useState } from 'react'

import { ResponsiveValue } from '../../prop-controllers'
import { useMediaQuery } from '../hooks'
import { Element } from '../../state/react-page'

export type BoxAnimateIn =
  | 'none'
  | 'fadeIn'
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'blurIn'
  | 'scaleUp'
  | 'scaleDown'

const defaultExitedProps = {
  opacity: 0,
  x: 0,
  y: 0,
  scale: 1,
}

type BoxAnimationVariants = {
  entered: TargetAndTransition
  exited: TargetAndTransition
}

export const boxAnimations: {
  [key in BoxAnimateIn]: {
    transition: TransitionMap
  } & BoxAnimationVariants
} = {
  none: {
    entered: {
      opacity: 1,
    },
    exited: {
      ...defaultExitedProps,
      opacity: 1,
    },
    transition: {},
  },
  fadeIn: {
    exited: defaultExitedProps,
    entered: {
      opacity: 1,
    },
    transition: {},
  },
  fadeLeft: {
    exited: {
      ...defaultExitedProps,
      x: 60,
    },
    entered: {
      opacity: 1,
      x: 0,
    },
    transition: {
      x: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  fadeRight: {
    exited: {
      ...defaultExitedProps,
      x: -60,
    },
    entered: {
      opacity: 1,
      x: 0,
    },
    transition: {
      x: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  fadeUp: {
    exited: {
      ...defaultExitedProps,
      y: 80,
    },
    entered: {
      opacity: 1,
      y: 0,
    },
    transition: {
      y: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  fadeDown: {
    exited: {
      ...defaultExitedProps,
      y: -80,
    },
    entered: {
      opacity: 1,
      y: 0,
    },
    transition: {
      y: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  blurIn: {
    exited: {
      ...defaultExitedProps,
      filter: 'blur(20px)',
    },
    entered: {
      opacity: 1,
      filter: 'blur(0px)',
    },
    transition: {},
  },
  scaleDown: {
    exited: {
      ...defaultExitedProps,
      scale: 1.2,
    },
    entered: {
      opacity: 1,
      scale: 1,
    },
    transition: {
      scale: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  scaleUp: {
    exited: {
      ...defaultExitedProps,
      scale: 0.75,
    },
    entered: {
      opacity: 1,
      scale: 1,
    },
    transition: {
      scale: {
        type: 'tween',
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
}

const mergeCustomTransitionWithDefault = (
  transitions: TransitionMap,
  props: Transition,
): TransitionMap | Transition =>
  transitions
    ? Object.keys(transitions).reduce(
        (a, c) => ({
          ...a,
          [c]: {
            ...transitions[c as string],
            ...props,
          },
        }),
        props,
      )
    : props

export type BoxAnimationType = {
  containerAnimationProps: {
    transition: Transition
    variants: Variants
  }
  parentAnimationProps: {
    transition: Transition
  }
  childAnimationProps: {
    transition: Transition
    variants: Variants
  }
}

const useElementOnScreen = (element: HTMLElement | null, options: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCallback, options)

    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }

    function intersectionCallback([entry]: IntersectionObserverEntry[]) {
      if (entry?.isIntersecting) {
        setIsVisible(true)
      }
    }
  }, [element, options])

  return isVisible
}

export const DEFAULT_BOX_ANIMATE_TYPE = 'none'
export const DEFAULT_BOX_ANIMATE_DELAY = 0.0
export const DEFAULT_BOX_ANIMATE_DURATION = 0.75
export const DEFAULT_ITEM_ANIMATE_TYPE = 'none'
export const DEFAULT_ITEM_ANIMATE_DELAY = 0.0
export const DEFAULT_ITEM_ANIMATE_DURATION = 0.75
export const DEFAULT_ITEM_STAGGER_DURATION = 0.0

type UseBoxAnimationsPayload = {
  initial?: { container: MotionProps['initial']; parent: MotionProps['initial'] }
  animate?: { container: MotionProps['animate']; parent: MotionProps['animate'] }
  variants?: { container: MotionProps['variants']; child: MotionProps['variants'] }
  transition?: {
    container: MotionProps['transition']
    parent: MotionProps['transition']
    child: MotionProps['transition']
  }
  key?: { container: string }
}

export const useBoxAnimations = ({
  boxElement,
  elements,
  ...props
}: {
  boxAnimateType: ResponsiveValue<BoxAnimateIn> | undefined
  boxAnimateDuration: ResponsiveValue<number> | undefined
  boxAnimateDelay: ResponsiveValue<number> | undefined
  itemAnimateType: ResponsiveValue<BoxAnimateIn> | undefined
  itemAnimateDuration: ResponsiveValue<number> | undefined
  itemAnimateDelay: ResponsiveValue<number> | undefined
  itemStaggerDuration: ResponsiveValue<number> | undefined
  boxElement: HTMLElement | null
  elements: Element[] | undefined
}): UseBoxAnimationsPayload => {
  const reducedMotion = useReducedMotion()
  const boxAnimateType = useMediaQuery(props.boxAnimateType) || DEFAULT_BOX_ANIMATE_TYPE
  const boxAnimateDuration = useMediaQuery(props.boxAnimateDuration) || DEFAULT_BOX_ANIMATE_DURATION
  const boxAnimateDelay = useMediaQuery(props.boxAnimateDelay) || DEFAULT_BOX_ANIMATE_DELAY
  const itemAnimateType = useMediaQuery(props.itemAnimateType) || DEFAULT_ITEM_ANIMATE_TYPE
  const itemAnimateDuration =
    useMediaQuery(props.itemAnimateDuration) || DEFAULT_ITEM_ANIMATE_DURATION
  const itemAnimateDelay = useMediaQuery(props.itemAnimateDelay) || DEFAULT_ITEM_ANIMATE_DELAY
  const itemStaggerDuration =
    useMediaQuery(props.itemStaggerDuration) || DEFAULT_ITEM_STAGGER_DURATION

  const isBoxVisible = useElementOnScreen(boxElement, {
    root: null,
    rootMargin: `0px 0px -10% 0px`,
    threshold: 0.2,
  })

  const itemControls = useAnimation()
  const boxControls = useAnimation()

  const setSequence = useCallback(
    (variant: keyof BoxAnimationVariants) => {
      boxControls.stop()
      itemControls.stop()
      boxControls.set(variant)
      itemControls.set(variant)
    },
    [boxControls, itemControls],
  )

  const playSequence = useCallback(() => {
    boxControls.stop()
    itemControls.stop()
    boxControls.set('exited')
    itemControls.set('exited')
    boxControls.start('entered')
    itemControls.start('entered')
  }, [boxControls, itemControls])

  useEffect(() => {
    if (isBoxVisible) {
      setSequence('entered')
    }
  }, [
    elements
      ?.map(e => e.key)
      .sort()
      .join(),
    setSequence,
  ])

  useEffect(() => {
    if (isBoxVisible) {
      playSequence()
    }
  }, [
    isBoxVisible,
    boxAnimateType,
    boxAnimateDuration,
    boxAnimateDelay,
    itemAnimateType,
    itemAnimateDuration,
    itemAnimateDelay,
    itemStaggerDuration,
    reducedMotion,
    playSequence,
  ])

  const boxVariant = boxAnimations[boxAnimateType]
  const itemVariant = boxAnimations[itemAnimateType]

  return {
    initial: {
      container: reducedMotion ? 'entered' : 'exited',
      parent: reducedMotion ? 'entered' : 'exited',
    },
    animate: {
      container: reducedMotion ? undefined : boxControls,
      parent: reducedMotion ? undefined : itemControls,
    },
    variants: {
      container: {
        exited: boxVariant.exited,
        entered: boxVariant.entered,
      },
      child: {
        exited: itemVariant.exited,
        entered: itemVariant.entered,
      },
    },
    transition: {
      container: mergeCustomTransitionWithDefault(boxVariant.transition, {
        delay: boxAnimateDelay,
        duration: boxAnimateDuration,
      }),
      parent: {
        delayChildren: itemAnimateDelay,
        staggerChildren: itemStaggerDuration,
        duration: itemAnimateDuration,
      },
      child: mergeCustomTransitionWithDefault(itemVariant.transition, {
        duration: itemAnimateDuration,
      }),
    },
    key: {
      container:
        boxAnimateType +
        boxAnimateDuration +
        boxAnimateDelay +
        itemAnimateType +
        itemAnimateDuration +
        itemAnimateDelay +
        itemStaggerDuration +
        reducedMotion,
    },
  }
}

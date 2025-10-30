'use client'

import { ComponentPropsWithoutRef, ElementType, ReactNode, useEffect, useState, memo } from 'react'
import { cx } from '@emotion/css'

import { SlotDefinition, SlotControl, type DataType } from '@makeswift/controls'

import { Element } from '../components/Element'
import { getIndexes } from '../../../components/utils/columns'
import { useResponsiveStyle } from '../../../components/utils/responsive-style'
import { useStyle } from '../use-style'
import { pollBoxModel } from '../poll-box-model'

export function renderSlot(props: {
  data: DataType<SlotDefinition<ReactNode>> | undefined
  control: SlotControl | null
}): ReactNode {
  return <SlotValue {...props} />
}

const SlotValue = memo(
  ({
    data,
    control,
  }: {
    data: DataType<SlotDefinition<ReactNode>> | undefined
    control: SlotControl | null
  }): ReactNode => {
    // TODO(miguel): While the UI shouldn't allow the state, we should probably check that at least
    // one element is visible.
    if (data == null || data.elements.length === 0) {
      return <Slot.Placeholder control={control} />
    }

    return (
      <Slot control={control}>
        {data.elements.map((element, i) => (
          <Slot.Item key={element.key} control={control} grid={data.columns} index={i}>
            <Element element={element} />
          </Slot.Item>
        ))}
      </Slot>
    )
  },
)

type SlotProps<T extends ElementType> = {
  as?: T
  control: SlotControl | null
  children?: ReactNode
  className?: string
}

export function Slot<T extends ElementType = 'div'>({
  as,
  control,
  children,
  className,
  ...restOfProps
}: SlotProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SlotProps<T>>) {
  const As = as ?? 'div'
  const [element, setElement] = useState<Element | null>(null)
  const baseClassName = useStyle({
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  })

  useEffect(() => {
    if (element == null || control == null) return

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeContainerBoxModel(boxModel),
    })
  }, [element, control])

  return (
    <As {...restOfProps} ref={setElement} className={cx(baseClassName, className)}>
      {children}
    </As>
  )
}

Slot.Placeholder = SlotPlaceholder

Slot.Item = SlotItem

type SlotItemProps<T extends ElementType> = {
  as?: T
  control: SlotControl | null
  // @arvin: review for correctness
  grid: DataType<SlotDefinition<ReactNode>> extends undefined
    ? undefined
    : NonNullable<DataType<SlotDefinition<ReactNode>>>['columns']
  index: number
  children?: ReactNode
  className?: string
}

function SlotItem<T extends ElementType = 'div'>({
  as,
  control,
  grid,
  index,
  children,
  className,
  ...restOfProps
}: SlotItemProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SlotItemProps<T>>): ReactNode {
  const As = as ?? 'div'
  const [element, setElement] = useState<Element | null>(null)
  const baseClassName = useStyle({
    display: 'flex',
    ...useResponsiveStyle([grid], ([{ count = 12, spans = [[12]] } = {}]) => {
      const [rowIndex, columnIndex] = getIndexes(spans, index)
      const span = spans[rowIndex][columnIndex]
      const flexBasis = `calc(100% * ${(span / count).toFixed(5)})`

      return span === 0 ? { display: 'none' } : { flexBasis, minWidth: flexBasis }
    }),
  })

  useEffect(() => {
    if (element == null || control == null) return

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeItemBoxModel(index, boxModel),
    })
  }, [element, control, index])

  return (
    <As {...restOfProps} ref={setElement} className={cx(baseClassName, className)}>
      {children}
    </As>
  )
}

type SlotPlaceholderProps = {
  control: SlotControl | null
}

function SlotPlaceholder({ control }: SlotPlaceholderProps): ReactNode {
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (element == null || control == null) return

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeContainerBoxModel(boxModel),
    })
  }, [element, control])

  return (
    <div
      ref={setElement}
      className={useStyle({
        width: '100%',
        background: 'rgba(161, 168, 194, 0.18)',
        height: '80px',
      })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={useStyle({ overflow: 'visible', padding: 8 })}
      >
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          strokeWidth={2}
          strokeDasharray="4 2"
          fill="none"
          stroke="rgba(161, 168, 194, 0.40)"
          rx="4"
          ry="4"
        />
      </svg>
    </div>
  )
}

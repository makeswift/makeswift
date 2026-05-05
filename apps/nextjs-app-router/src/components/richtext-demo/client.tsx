import { Ref, forwardRef, type ReactNode } from 'react'

export const TwoColumnText = forwardRef(
  (
    {
      className,
      layout,
      leftText,
      rightText,
    }: {
      className: string
      layout: 'rows' | 'columns'
      leftText: ReactNode
      rightText: ReactNode
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        className={[
          'p-3 gap-3 w-full',
          layout === 'rows' ? 'flex flex-col' : 'grid grid-cols-2',
          className,
        ].join(' ')}
        ref={ref}
      >
        {leftText}
        {rightText}
      </div>
    )
  },
)

export default TwoColumnText

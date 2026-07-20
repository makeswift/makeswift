import { Ref, forwardRef } from 'react'

// The cascade resolves to its last (images) stage: the selected image option.
type ImageSelection = { id: string; image: string; text?: string }

type Props = {
  className?: string
  selection?: ImageSelection
}

export const CascadeDemo = forwardRef(function CascadeDemo(
  { className, selection }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 w-full ${className ?? ''}`}
      ref={ref}
    >
      <h3 className="text-sm font-semibold">Cascade Control Demo</h3>

      <section>
        <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          Selected image
        </h4>
        {selection != null ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selection.image}
            alt={selection.text ?? 'Selected image'}
            className="rounded border border-gray-200 max-w-xs h-auto"
          />
        ) : (
          <p className="text-sm text-gray-400">No image selected</p>
        )}
      </section>
    </div>
  )
})

export default CascadeDemo

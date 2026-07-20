import { Ref, forwardRef } from 'react'

type Product = { id: string; label: string }

type Props = {
  className?: string
  product?: Product
}

export const CascadeDemo = forwardRef(function CascadeDemo(
  { className, product }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div className={`p-4 text-lg ${className ?? ''}`} ref={ref}>
      {product == null ? (
        <span>No product selected</span>
      ) : (
        <span>
          Selected product: <strong>{product.label}</strong> ({product.id})
        </span>
      )}
    </div>
  )
})

export default CascadeDemo

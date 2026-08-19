import { Ref, forwardRef } from 'react'

type ProductImage = { src: string; label?: string }
type Product = { id: string; label: string }

type Props = {
  className?: string
  // The cascade resolves to the last defined step: the selected Gallery image
  // once one is picked, otherwise the deepest upstream selection (product).
  product?: ProductImage | Product
}

function isImage(value: ProductImage | Product): value is ProductImage {
  return 'src' in value
}

export const CascadeDemo = forwardRef(function CascadeDemo(
  { className, product }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div className={`p-4 text-lg ${className ?? ''}`} ref={ref}>
      {product == null ? (
        <span>No product selected</span>
      ) : isImage(product) ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.src} alt={product.label ?? ''} width={300} height={300} />
          {product.label && <figcaption>{product.label}</figcaption>}
        </figure>
      ) : (
        <span>
          Selected product: <strong>{product.label}</strong> ({product.id})
        </span>
      )}
    </div>
  )
})

export default CascadeDemo

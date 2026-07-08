import { type GalleryOption } from '@makeswift/runtime/controls'

// Matches the `value` shape returned by the `Combobox`'s `getOptions` below
// (Combobox resolves to the selected option's `value`, not the whole option).
type Product = { id: string; label: string }

type Props = {
  className?: string
  productId?: Product
  productImage?: GalleryOption
}

export function ProductImageDemo({ className, productId, productImage }: Props) {
  return (
    <div className={className}>
      <p>Selected product: {productId?.label ?? '(none)'}</p>
      {productImage != null ? (
        <img
          src={productImage.src}
          alt={productImage.label ?? ''}
          style={{ maxWidth: 240 }}
        />
      ) : (
        <p>(no image selected)</p>
      )}
    </div>
  )
}

export default ProductImageDemo

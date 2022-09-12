import Image from 'next/image'
import Link from 'next/link'

import { useProduct } from 'lib/product-context'

type ProductImagesProps = {
  className?: string
}

export function ProductImages({ className }: ProductImagesProps) {
  const product = useProduct()
  const image = product.images.edges[0]?.node
  return (
    <div className={`${className} grid grid-cols-1 gap-6`}>
      <div className="flex flex-col gap-3">
        <Image
          className=""
          src={image.urlOriginal}
          alt={image.altText}
          layout="responsive"
          width="650"
          height="740"
          priority={true}
        />

        <div className="flex gap-2 justify-center items-center">
          <Image src={image.urlOriginal} alt={image.altText} width="80" height="80" />
          <Image src={image.urlOriginal} alt={image.altText} width="80" height="80" />
          <Image src={image.urlOriginal} alt={image.altText} width="80" height="80" />
        </div>
      </div>
    </div>
  )
}

type ProductBreadcrumbProps = {
  className?: string
}

export function ProductBreadcrumbs({ className }: ProductBreadcrumbProps) {
  const product = useProduct()

  return (
    <div className={`${className} bg-[#FEF6F1] text-sm space-x-1 font-light flex py-4 px-5`}>
      <Link className="text-black/60" href={'/'}>
        All Plants
      </Link>
      <div className="text-black/60">/</div>
      <Link className="text-black" href={`/product/${product.entityId}`}>
        {product.name}
      </Link>
    </div>
  )
}

type ProductPriceProps = {
  className?: string
}

export function ProductPrice({ className }: ProductPriceProps) {
  const product = useProduct()

  return (
    <div className={`${className} text-[28px] text-green font-light`}>
      ${product.prices.price.value}
    </div>
  )
}

type ProductNameProps = {
  className?: string
}

export function ProductName({ className }: ProductNameProps) {
  const product = useProduct()

  return <div className={`${className} text-[44px] text-black font-light`}>{product.name}</div>
}

type ProductDescriptionProps = {
  className?: string
}

export function ProductDescription({ className }: ProductDescriptionProps) {
  const product = useProduct()

  return (
    <div
      className={`${className} text-lg text-black/70 font-light`}
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  )
}

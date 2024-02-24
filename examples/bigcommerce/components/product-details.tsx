/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import { useProductFromPath } from 'lib/product-context'
import { usePreviewableTranslation } from 'components'

type ProductImagesProps = {
  className?: string
}

export function ProductImages({ className }: ProductImagesProps) {
  const product = useProductFromPath()
  const image = product.images.edges[0]?.node
  return (
    <div className={`${className} grid grid-cols-1 gap-6`}>
      <div className="flex flex-col gap-3">
        <img className="" src={image.urlOriginal} alt={image.altText} />

        <div className="flex gap-2 justify-center items-center">
          <img src={image.urlOriginal} alt={image.altText} width="80" />
          <img src={image.urlOriginal} alt={image.altText} width="80" />
          <img src={image.urlOriginal} alt={image.altText} width="80" />
        </div>
      </div>
    </div>
  )
}

type ProductBreadcrumbProps = {
  className?: string
}

export function ProductBreadcrumbs({ className }: ProductBreadcrumbProps) {
  const product = useProductFromPath()
  const { t } = usePreviewableTranslation('product')

  return (
    <div className={`${className} bg-[#FEF6F1] text-sm space-x-1 font-light flex py-4 px-5`}>
      <Link className="text-black/60" href={'/'}>
        {t('all-plants')}
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
  const product = useProductFromPath()

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
  const product = useProductFromPath()

  return <div className={`${className} text-[44px] text-black font-light`}>{product.name}</div>
}

type ProductDescriptionProps = {
  className?: string
}

export function ProductDescription({ className }: ProductDescriptionProps) {
  const product = useProductFromPath()

  return (
    <div
      className={`${className} text-lg text-black/70 font-light`}
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  )
}

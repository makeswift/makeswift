import useSWR from 'swr'
import { fetcher } from './fetcher'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ProductContext } from './makeswift/context'
import { useContext } from 'react'

type Props = {
  className?: string
}

const ProductDetail = ({ className }: Props) => {
  const product = useContext(ProductContext)

  return (
    <div className={`${className} grid grid-cols-2 gap-6`}>
      <div className="flex flex-col gap-3">
        <Image
          className="rounded-t-lg"
          src={product.defaultImage.url}
          alt="Product"
          width="416"
          height="416"
        />

        <div className="flex gap-2">
          {product.images.edges.map(({ node }: any) => (
            <Image
              key={node.url}
              className="rounded-t-lg"
              src={node.url}
              alt="Product"
              width="208"
              height="208"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-3xl">{product.name}</p>
        <p className="text-2xl text-gray-700 font-bold">$ {product.prices.price.value}</p>
      </div>
    </div>
  )
}

export default ProductDetail

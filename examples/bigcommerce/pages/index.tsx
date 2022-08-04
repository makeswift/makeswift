import { NextPage } from 'next'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
  const [page, setPage] = useState<string | null>(null)
  const { data, error } = useSWR(
    page ? `/api/bigcommerce/products?cursor=${page}` : '/api/bigcommerce/products',
    fetcher,
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div>
      <div className="flex gap-3 flex-wrap justify-start">
        {data.data.site.products.edges.map(edge => {
          const product = edge.node
          console.log(product)
          return (
            <Link href={`/product/${product.entityId}`} key={product.entityId}>
              <a className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md w-52">
                <Image
                  className="rounded-t-lg"
                  src={product.defaultImage.url}
                  alt="Product"
                  width="208"
                  height="208"
                />
                <div className="p-5 pt-3 flex flex-col gap-2">
                  <p className="text-sm text-gray-700 max-h-16 overflow-hidden">{product.name}</p>
                  <p className="text-base text-gray-700 font-bold">
                    {/* $ {node.priceRange.minVariantPrice.amount} */}
                  </p>
                </div>
              </a>
            </Link>
          )
        })}
      </div>

      {data.data.site.products.pageInfo.hasNextPage && (
        <button
          onClick={() => {
            return setPage(data.data.site.products.pageInfo.endCursor)
          }}
        >
          next
        </button>
      )}
    </div>
  )
}

export default Home

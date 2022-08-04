import { NextPage } from 'next'
import useSWR from 'swr'
import { fetcher } from '../../lib/fetcher'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const { data, error } = useSWR(`/api/bigcommerce/product/${router.query.id}`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const product = data.data.site.products.edges[0].node

  return (
    <div className={`grid grid-cols-2 gap-6`}>
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

export default Home

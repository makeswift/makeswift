import { useContext } from "react";
import { Style } from "@makeswift/runtime/controls";
import { ReactRuntime } from "@makeswift/runtime/react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

import { fetcher } from "../fetcher";
import { PathContext } from "./context";

function ProductList(props: { className?: string }) {
  const { data, error } = useSWR("/api/shopify/products", fetcher);

  if (error) return null;

  if (data == null) return null;

  return (
    <div {...props}>
      <div className="flex gap-3 flex-wrap justify-start">
        {data.products.edges.map(({ node }: any) => {
          return (
            <Link href={`/product/${node.id.split("/")[4]}`} key={node.id}>
              <a className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md w-52">
                <Image
                  className="rounded-t-lg"
                  src={node.featuredImage.url}
                  alt="Product"
                  width="208"
                  height="208"
                />
                <div className="p-5 pt-3 flex flex-col gap-2">
                  <p className="text-sm text-gray-700 max-h-16 overflow-hidden">
                    {node.title}
                  </p>
                  <p className="text-base text-gray-700 font-bold">
                    $ {node.priceRange.minVariantPrice.amount}
                  </p>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

ReactRuntime.registerComponent(ProductList, {
  type: "product-list",
  label: "Product List",
  props: {
    className: Style({ properties: Style.All }),
  },
});

const DEFAULT_PRODUCT_ID = "7787289870593";

function ProductDetail(props: { className?: string }) {
  const pathContextValue = useContext(PathContext);
  const path =
    pathContextValue?.[0] === "product"
      ? pathContextValue?.[1]
      : DEFAULT_PRODUCT_ID;

  const { data, error } = useSWR(`/api/shopify/product/${path}`, fetcher);

  if (error) return <p>Error!</p>;

  if (data == null) return <p>Loading</p>;

  return (
    <div className={`${props?.className} grid grid-cols-2 gap-6`}>
      <div className="flex flex-col gap-3">
        <Image
          className="rounded-t-lg"
          src={data.product.images.edges[0].node.url}
          alt="Product"
          width="416"
          height="416"
        />

        <div className="flex gap-2">
          {data.product.images.edges.slice(1).map(({ node }: any) => (
            <Image
              key={node.id}
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
        <p className="text-3xl">{data.product.title}</p>
        <p className="text-2xl text-gray-700 font-bold">
          $ {data.product.priceRange.minVariantPrice.amount}
        </p>
      </div>
    </div>
  );
}

ReactRuntime.registerComponent(ProductDetail, {
  type: "product-detail",
  label: "Product Detail",
  props: {
    className: Style({ properties: Style.All }),
  },
});

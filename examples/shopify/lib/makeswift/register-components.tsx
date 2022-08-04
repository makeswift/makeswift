import { useContext } from "react";
import { Style } from "@makeswift/runtime/controls";
import { ReactRuntime } from "@makeswift/runtime/react";
import Image from "next/image";
import Link from "next/link";

import { ItemsContext, ProductContext } from "./context";

function ProductList(props: { className?: string }) {
  const items = useContext(ItemsContext);

  return (
    <div className={`${props?.className} flex gap-3 flex-wrap justify-start`}>
      {items.products.edges.map(({ node }: any) => {
        return (
          <Link href={`/products/${node.id.split("/")[4]}`} key={node.id}>
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
  );
}

ReactRuntime.registerComponent(ProductList, {
  type: "product-list",
  label: "Product List",
  props: {
    className: Style({ properties: Style.All }),
  },
});

function ProductDetail(props: { className?: string }) {
  const product = useContext(ProductContext);

  return (
    <div className={`${props?.className} grid grid-cols-2 gap-6`}>
      <div className="flex flex-col gap-3">
        <Image
          className="rounded-t-lg"
          src={product.product.images.edges[0].node.url}
          alt="Product"
          width="416"
          height="416"
        />

        <div className="flex gap-2">
          {product.product.images.edges.slice(1).map(({ node }: any) => (
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
        <p className="text-3xl">{product.product.title}</p>
        <p className="text-2xl text-gray-700 font-bold">
          $ {product.product.priceRange.minVariantPrice.amount}
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

import "../../lib/makeswift/register-components";

import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from "@makeswift/runtime/next";
import { ItemsContext } from "../../lib/makeswift/context";
import { getProducts } from "../../lib/shopify/shopify";

type Props = MakeswiftPageProps & {
  items: any;
};

export async function getStaticProps(
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    params: { ...ctx.params, path: ["products"] },
  });

  const items = await getProducts();

  return {
    ...makeswiftResult,
    props: {
      // @ts-ignore
      ...makeswiftResult.props,
      items,
    },
  };
}

export default function Page({ items, ...restOfProps }: Props) {
  return (
    <ItemsContext.Provider value={items}>
      <MakeswiftPage {...restOfProps} />
    </ItemsContext.Provider>
  );
}

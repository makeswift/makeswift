import "../lib/makeswift/register-components";

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
import { PathContext } from "../lib/makeswift/context";
export { getStaticPaths } from "@makeswift/runtime/next";

type Props = MakeswiftPageProps & {
  path: string[];
};

export async function getStaticProps(
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const path =
    ctx.params?.path?.[0] === "product" ? ["__product__"] : ctx.params?.path;

  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    // @ts-ignore
    params: { ...ctx.params, path },
  });

  return {
    ...makeswiftResult,
    props: {
      // @ts-ignore
      ...makeswiftResult.props,
      ...(ctx.params?.path == null ? {} : { path: ctx.params?.path }),
    },
  };
}

export default function Page({ path, ...restOfProps }: Props) {
  return (
    <PathContext.Provider value={path}>
      <MakeswiftPage {...restOfProps} />
    </PathContext.Provider>
  );
}

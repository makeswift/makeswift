import { getCategoryTree } from '~/client/queries/get-category-tree';

import { BaseHeaderNav } from './base';

interface Props {
  className?: string;
  inCollapsedNav?: boolean;
}

export const HeaderNav = async ({ className, inCollapsedNav }: Props) => {
  const categoryTree = await getCategoryTree();

  return (
    <BaseHeaderNav
      categoryTree={categoryTree}
      className={className}
      inCollapsedNav={inCollapsedNav}
    />
  );
};

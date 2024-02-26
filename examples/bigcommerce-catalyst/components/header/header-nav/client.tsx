import { useCategoryTree } from '~/providers/bc-data-provider';

import { BaseHeaderNav } from './base';

interface Props {
  className?: string;
  inCollapsedNav?: boolean;
}

export const HeaderNav = ({ className, inCollapsedNav }: Props) => {
  const categoryTree = useCategoryTree();

  return (
    <BaseHeaderNav
      categoryTree={categoryTree}
      className={className}
      inCollapsedNav={inCollapsedNav}
    />
  );
};

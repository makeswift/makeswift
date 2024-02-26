import { getCategoryTree } from '~/client/queries/get-category-tree';
import { ExistingResultType } from '~/client/util';

import { BaseFooterMenu } from './base-footer-menu';

type CategoryTree = ExistingResultType<typeof getCategoryTree>;

interface Props {
  categoryTree: CategoryTree;
}

export const CategoryFooterMenu = ({ categoryTree }: Props) => {
  if (!categoryTree.length) {
    return null;
  }

  return <BaseFooterMenu items={categoryTree} title="Categories" />;
};

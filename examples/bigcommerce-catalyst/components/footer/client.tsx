import {
  useBrands,
  useCategoryTree,
  useStoreSettings,
  useWebPages,
} from '~/providers/bc-data-provider';

import { BaseFooter } from './base';

export const Footer = () => {
  const storeSettings = useStoreSettings();
  const categoryTree = useCategoryTree();
  const brands = useBrands();
  const webPages = useWebPages();

  return (
    <BaseFooter
      brands={brands}
      categoryTree={categoryTree}
      storeSettings={storeSettings}
      webPages={webPages}
    />
  );
};

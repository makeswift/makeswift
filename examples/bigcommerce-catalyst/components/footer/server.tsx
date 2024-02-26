import { getInitialData } from '~/client/queries/get-initial-data';

import { BaseFooter } from './base';

export const Footer = async () => {
  const { brands, categoryTree, storeSettings, webPages } = await getInitialData();

  return (
    <BaseFooter
      brands={brands}
      categoryTree={categoryTree}
      storeSettings={storeSettings}
      webPages={webPages}
    />
  );
};
